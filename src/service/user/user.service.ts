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

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {

  constructor(private userMstRepository: UserMstRepository, private passwordEncryptionService: PasswordEncryptionService) {
  }


  public async findAll(): Promise<UserMstEntity[]> {
    return await this.userMstRepository.find();
  }


  public async findById(id: number): Promise<UserMstEntity | null> {
    return await this.userMstRepository.findOneOrFail(id, {
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

  public async create(UserMstEntity: UserMstEntity): Promise<UserMstEntity> {
    return await this.userMstRepository.save(UserMstEntity);
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

  public async forgotPasswordLinkGenerate(email: string): Promise<string> {

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

    return "?q=" + token;

  }

  public async changePassword(token: string, oldPassword: string, newPassword) {
    let users = await this.userMstRepository.find({
      where: { forgotPassToken: token }
    });

    if (users.length == 0) {
      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password token invalid.");
    }

    if (users[0].forgotPassTokenExp.getTime() < Date.now()) {
      throw new BusinessException(Constants.FAILURE_CODE, "Forgot password token expired");
    }

    if (this.passwordEncryptionService.decrypt(users[0].password) != oldPassword) {
      throw new BusinessException(Constants.FAILURE_CODE, "Invalid passowrd");
    }

    console.log(newPassword+"encrypted password-:"+this.passwordEncryptionService.encrypt(newPassword));
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

}
