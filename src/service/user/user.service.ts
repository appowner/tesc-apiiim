import { Injectable } from '@nestjs/common';
import { UserMstRepository } from 'src/repository/user-mst-repository';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { DeleteResult } from 'typeorm';
import { BusinessError } from 'src/model/business-error';
import { BusinessException } from 'src/model/business-exception';
import { Constants } from 'src/model/constants';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { PasswordEncryptionService } from 'src/auth/password-encryption/password-encryption.service';
import { RestCallService } from '../rest-call/rest-call.service';
import { Request } from 'express';
import { RoleRepository } from 'src/repository/role-repository';
import { EntityMasterRepository } from 'src/repository/entity-master-repository';
import { ClaimMasterEntity } from 'src/entity/claim-master.entity';
import { RoleEntity } from 'src/entity/role.entity';
import { ClaimMasterRepository } from 'src/repository/claim-master-repository';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {

  constructor(private userMstRepository: UserMstRepository, private passwordEncryptionService: PasswordEncryptionService,
    private restCallService: RestCallService, private roleRepository: RoleRepository, private entityMasterRepository: EntityMasterRepository
    , private claimMasterRepository: ClaimMasterRepository) {
  }


  public async findAll(): Promise<UserMstEntity[]> {
    return await this.userMstRepository.find();
  }


  public async findById(id: number): Promise<UserMstEntity | null> {
    return await this.userMstRepository.findOneOrFail(id, {
      relations: ["address"],
    });
  }

  public async findByIds(ids: number[]): Promise<UserMstEntity[] | null> {
    return await this.userMstRepository.findByIds(ids, {
      relations: ["address"],
    });
  }

  public async findByUserName(userName: string): Promise<UserMstEntity | null> {
    // return await this.userMstRepository.findOne({where : {userName : userName}});
    return await this.userMstRepository.findOne({ where: "LOWER(user_name) = LOWER('" + userName + "')" });
  }

  public async findByContactNumber(contactNo: string): Promise<UserMstEntity | null> {
    return await this.userMstRepository.findOne({ where: "(contact_number) = ('" + contactNo + "')" });
  }

  getUniqueCode(): string {
    return CryptoJS.lib.WordArray.random(10).toString().toUpperCase();
  }

  public async create(req, userMstEntity: UserMstEntity): Promise<UserMstEntity> {
    if (userMstEntity.email && userMstEntity.email.length > 0) {
      let emails = await this.userMstRepository.find({ where: { email: userMstEntity.email } });

      if (emails.length > 0) {
        throw new BusinessException(Constants.FAILURE_CODE, "Email aleady exists");
      }

    }

    if (userMstEntity.userName && userMstEntity.userName.length > 0) {
      let userName = await this.userMstRepository.find({ where: { userName: userMstEntity.userName } });

      if (userName.length > 0) {
        throw new BusinessException(Constants.FAILURE_CODE, "Username aleady exists");
      }

    }

    if (userMstEntity.contactNumber && userMstEntity.contactNumber.length > 0) {
      let contactNumber = await this.userMstRepository.find({ where: { contactNumber: userMstEntity.contactNumber } });

      if (contactNumber.length > 0) {
        throw new BusinessException(Constants.FAILURE_CODE, "Contact no aleady exists");
      }

    }

    if (userMstEntity.password) {
      userMstEntity.password = this.passwordEncryptionService.encrypt(userMstEntity.password);
    } else {
      userMstEntity.password = this.getUniqueCode();
      userMstEntity.password = this.passwordEncryptionService.encrypt(userMstEntity.password);
    }

    userMstEntity.createdDate = new Date();
    let usr = await this.userMstRepository.save(userMstEntity);
    if (usr.email) {
      let mail = [];
      mail.push(usr.email);
      await this.restCallService.sendMail(req, mail, "TESC Logistics - A Revolution in 3PL", this.welcomeUserMailHtml.replace("[user]", usr.firstName));
      await this.restCallService.sendMail(req, mail, "TESC Logistics - A Revolution in 3PL Password", "Password-: " + this.passwordEncryptionService.decrypt(usr.password));
    }
    return usr;
  }

  public async saveOTP(UserMstEntity: UserMstEntity): Promise<UserMstEntity> {
    return await this.userMstRepository.save(UserMstEntity);
  }

  public async update(
    id: number,
    newValue: UserMstEntity,
  ): Promise<UserMstEntity | null> {
    const UserMstEntity = await this.userMstRepository.findOneOrFail(id);
    if (!UserMstEntity.id) {
      // tslint:disable-next-line:no-console
      console.error("UserMstEntity doesn't exist");
    }
    newValue.updatedDate = new Date();
    await this.userMstRepository.save(newValue);
    return await this.userMstRepository.findOne(id);
  }

  public async delete(id: number): Promise<DeleteResult> {

    // let userMst = this.userMstRepository.findOne(id);
    // (await userMst).active = false
    return await this.userMstRepository.delete(id);
  }

  public async forgotPasswordLinkGenerate(req: Request, email: string): Promise<string> {

    let users = await this.userMstRepository.find({ where: { email: email } });

    if (users.length == 0) {
      throw new BusinessException(Constants.FAILURE_CODE, "Email " + email + " is not registred.")
    }
    let token = CryptoJS.lib.WordArray.random(16).toString();
    let expireDate = new Date(Date.now() + (1000 * 60 * 60 * 24));

    await this.userMstRepository.createQueryBuilder("user")
      .update()
      .set({ forgotPassToken: token, forgotPassTokenExp: moment(expireDate).format('YYYY-MM-DD hh:mm') })
      .where({ id: users[0].id })
      .execute()
    // http://operations.dev.tesc.cloud/ - Admin Portal
    http://customers.dev.tesc.cloud/ - Customer Portal
    if (users[0].type === "CUSTOMER") {
      let mail = [];
      mail.push(email);
      await this.restCallService.sendMail(req, mail, "Forgot Password", process.env.CUSTOMER_FORGOT_PASSWORD_URL + token);
    } else {

      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password not implemented for user type-:" + users[0].type)
    }


    return "?q=" + token;

  }

  public async forgotUpdatePassword(token: string, oldPassword: string, newPassword) {
    let users = await this.userMstRepository.find({
      where: { forgotPassToken: token }
    });

    if (users.length == 0) {
      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password token invalid.");
    }

    if (users[0].forgotPassTokenExp.getTime() < Date.now()) {
      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password token expired");
    }

    // if (this.passwordEncryptionService.decrypt(users[0].password) != oldPassword) {
    //   throw new BusinessException(Constants.FAILURE_CODE, "Invalid passowrd");
    // }

    console.log(newPassword + "encrypted password-:" + this.passwordEncryptionService.encrypt(newPassword));
    await this.userMstRepository.createQueryBuilder("user")
      .update()
      .set({ forgotPassToken: null, forgotPassTokenExp: null, password: this.passwordEncryptionService.encrypt(newPassword) })
      .where({ id: users[0].id })
      .execute()

  }

  public async findByForgotPasswordToken(token: string): Promise<UserMstEntity | null> {
    let user = await this.userMstRepository.find({
      where: { forgotPassToken: token }
    });

    if (user.length == 0) {
      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password link invalid");
    }

    if (user[0].forgotPassTokenExp.getTime() < Date.now()) {
      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password link expired");
    }

    return user[0];
  }

  async findAllRole(): Promise<RoleEntity[]> {

    return this.roleRepository.find();

  }

  async findRoleById(id: number): Promise<RoleEntity> {

    return this.roleRepository.findOne(id);

  }

  async createRole(role: RoleEntity): Promise<RoleEntity> {

    return this.roleRepository.save(role);

  }

  async updateRole(role: RoleEntity): Promise<RoleEntity> {

    return this.roleRepository.save(role);

  }

  async getRoleClaimMappingId(roleId: number): Promise<any> {

    let role = await this.roleRepository.findOne(roleId);
    let claims = await this.claimMasterRepository.find({ where: { roleId: role.id } })
    let entityList = await this.entityMasterRepository.findByIds(claims.map(val => val.entityId));
    let entity;
    let json = {};


    for (let index = 0; index < claims.length; index++) {
      const element = claims[index];
      entity = entityList.find(val => val.id == element.entityId);

      if (!json[entity.groupName]) {
        json[entity.groupName] = []
      }

      element.entityMaster = entityList.find(val => val.id == claims[index].entityId);
      if (claims[index].isCreate == true || claims[index].isDelete == true || claims[index].isExport == true || claims[index].isImport == true ||
        claims[index].isPurge == true || claims[index].isRead == true || claims[index].isUpdate == true) {
        json[entity.groupName].push(element)
      }

    }
    let list = [];

    let keys = Object.keys(json);
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      list.push(JSON.parse("{\"" + element + "\" : " + JSON.stringify(json[element]) + "}"));
    }


    return list;

  }

  async getRoleClaimForUpdate(roleId: number): Promise<any> {

    let role = await this.roleRepository.findOne(roleId);
    let claims = await this.claimMasterRepository.find({ where: { roleId: role.id } })
    let entityList = await this.entityMasterRepository.find();
    let entity;
    let json = {};
    let claim: ClaimMasterEntity;

    for (let e = 0; e < entityList.length; e++) {
      entity = entityList[e];
      if (!json[entity.groupName]) {
        json[entity.groupName] = []
      }
      claim = claims.find(val => val.entityId == entity.id);

      if (claim) {
        claim.entityMaster = entity;
        json[entity.groupName].push(claim);
      } else {
        claim = new ClaimMasterEntity();
        claim.entityId = entity.id;
        claim.entityMaster = entity;
        claim.roleId = roleId;
        claim.isCreate = false;
        claim.isDelete = false;
        claim.isExport = false;
        claim.isImport = false;
        claim.isPurge = false;
        claim.isRead = false;
        claim.isUpdate = false;
        json[entity.groupName].push(claim);
      }

    }

    let list = [];

    let keys = Object.keys(json);
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      list.push(JSON.parse("{\"" + element + "\" : " + JSON.stringify(json[element]) + "}"));
    }


    return list;

  }

  async updateRoleClaims(claims: ClaimMasterEntity[]) {
    this.claimMasterRepository.save(claims);

  }


  welcomeUserMailHtml = "<style>\n" +
    ".font{\n" +
    "font-family:'Segoe UI','Apple SD Gothic Neo','Lucida Grande','Lucida Sans Unicode','sans-serif';\n" +
    "}\n" +
    "</style>\n" +
    "<div bgcolor=\"#FFFFFF\" marginwidth=\"0\" marginheight=\"0\">\n" +
    "    <table id=\"m_2515312712125314003Table_01\" width=\"600\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "      <tbody><tr>\n" +
    "        <td style=\"background:rgb(0, 0, 0);text-align:center;padding:20px 0\" class=\"font\">\n" +
    "          <a href=\"https://tesc.in/\" target=\"_blank\" title=\"TESC Logistics Redefined\"><img src=\"https://i1.wp.com/tesc.in/wp-content/uploads/2021/03/cropped-Tesc-Logo-Website-05-1.png?w=500&ssl=1\" height=\"150\" alt=\"TESC Logistics Redefined\" class=\"tesc\"></a>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "\t  <tr>\n" +
    "        <td style=\"    background: rgb(247, 247, 247);text-align: left;padding: 20px;font-size: 16px;font-weight: 400;\" class=\"font\">\n" +
    "          Dear [user],\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "\t  <tr>\n" +
    "        <td style=\"background:rgb(247, 247, 247); text-align: center; padding: 20px;  font-size: 20px;\"class=\"font\">\n" +
    "          Thank you for Register at  <br><a style=\"text-decoration: none; color: #000; font-size: 30px; font-weight: 800;\" title=\"TESC Logistics Redefined\" href=\"https://tesc.in/\" target=\"_blank\">TESC Logistics Redefined</a>\n" +
    "\t\t  <br>We will reach you very soon as Possible !!!\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td style=\"padding:20px 0;background:#efefef\">\n" +
    "          <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "            <tbody><tr>\n" +
    "\t\t\t   \n" +
    "              <td style=\"font-size:16px;color:#373435;text-align:justify;margin:20px 20px;background:#ffffff;letter-spacing:.68px;padding:15px;border-radius:5px;display:block;font-weight:600\" class=\"font\">\n" +
    "              TESC Logistics - A Revolution in 3PL\n" +
    "              <br>\n" +
    "\t\t\t  <br>\n" +
    "\t\t\t  Tech Enabled Supply Chain(Tesc), brings to you convenience and efficiency while moving your goods. Our focus is simplifying logistics via tech that helps our customers to move their freight with ease. \n" +
    "              <br>\n" +
    "\t\t\t  <br>\n" +
    "\t\t\t  \n" +
    "</td>\n" +
    "            </tr>\n" +
    "          </tbody></table>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td style=\"background-color:#000000;padding:25px 0 25px 30px\">\n" +
    "          <table style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "            <tbody><tr>\n" +
    "              <td>\n" +
    "                <table style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "                  <tbody><tr>\n" +
    "                    <td style=\"font-size:20px;font-weight:700;color:#ffffff\" class=\"font\">Thanks,</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td style=\"font-size:14px;color:#ffffff\" class=\"font\">TESC Logistics Redefined Team</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td><a href=\"mailto:enquiry@tesc.in\" title=\"enquiry@tesc.in\" class=\"font\" style=\"font-size:14px;color:#ffffff;text-decoration:none\" target=\"_blank\">enquiry@tesc.in</a>\n" +
    "                  </td>\n" +
    "                </tr>\n" +
    "              </tbody></table>\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "\n" +
    "</tbody></table>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr>\n" +
    "        <td style=\"background:#fff; text-align: center; padding: 5px 0;  font-size: 12px;\" class=\"font\">\n" +
    "          Design and Develop by <a style=\"text-decoration: none; font-weight: 600; color: #000;;\" title=\"TESC Logistics Redefined\" href=\"https://www.vihaainfotech.com/\" title=\"Vihaa Infotech\" target=\"_blank\">Vihaa Infotech</a>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "</tbody></table>\n" +
    "</div>"

}
