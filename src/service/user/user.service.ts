import { Injectable } from '@nestjs/common';
import { UserMstRepository } from 'src/repository/user-mst-repository';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { DeleteResult } from 'typeorm';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {

  constructor(private userMstRepository: UserMstRepository) {
  }


  public async findAll(): Promise<UserMstEntity[]> {
    return await this.userMstRepository.find();
  }


  public async findById(id: number): Promise<UserMstEntity | null> {
    return await this.userMstRepository.findOneOrFail(id,   {
      relations : ["address"],        
    });
  }

  public async findByUserName(userName: string): Promise<UserMstEntity | null> {
    // return await this.userMstRepository.findOne({where : {userName : userName}});
    return await this.userMstRepository.findOne({ where: "LOWER(user_name) = LOWER('" + userName + "')" });
  }

  public async create(UserMstEntity: UserMstEntity): Promise<UserMstEntity> {
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
    await this.userMstRepository.save( newValue);
    return await this.userMstRepository.findOne(id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userMstRepository.delete(id);
  }


}
