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
    console.log("userMstEntity--: "+JSON.stringify(userMstEntity));
    if(userMstEntity.password){
      userMstEntity.password = this.passwordEncryptionService.encrypt(userMstEntity.password);
    }else{
      userMstEntity.password = this.getUniqueCode();
      userMstEntity.password = this.passwordEncryptionService.encrypt(userMstEntity.password);
    }

    let usr =  await this.userMstRepository.save(userMstEntity);
    if(usr.email){
      let mail = [];
      mail.push(usr.email);
      await this.restCallService.sendMail(req, mail, "New Password", "Password-: "+this.passwordEncryptionService.decrypt(usr.password));
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
    await this.userMstRepository.save(newValue);
    return await this.userMstRepository.findOne(id);
  }

  public async delete(id: number): Promise<DeleteResult> {
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
        json[entity.groupName].push(element)

      }
      let list = [];

      let keys = Object.keys(json);
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        list.push(JSON.parse("{\""+element+"\" : "+JSON.stringify(json[element])+"}"));
      }
      
      
      return list;

  }

  async getRoleClaimForUpdate(roleId: number): Promise<any> {
        
      let role = await this.roleRepository.findOne(roleId);
      let claims = await this.claimMasterRepository.find({ where: { roleId: role.id } })
      let entityList = await this.entityMasterRepository.find();
      let entity;
      let json = {};
      let claim : ClaimMasterEntity;

      for (let e = 0; e < entityList.length; e++) {
         entity = entityList[e];
         if (!json[entity.groupName]) {
          json[entity.groupName] = []
        }       
        claim = claims.find(val => val.entityId == entity.id);  
        
        if(claim){
          claim.entityMaster = entity;
          json[entity.groupName].push(claim);
        }else{
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
        list.push(JSON.parse("{\""+element+"\" : "+JSON.stringify(json[element])+"}"));
      }
      
      
      return list;

  }

  async updateRoleClaims(claims : ClaimMasterEntity[]){
    this.claimMasterRepository.save(claims);

  }

}
