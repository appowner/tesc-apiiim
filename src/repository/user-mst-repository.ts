import { EntityRepository, Repository } from 'typeorm';
import { UserMstEntity } from 'src/entity/user-mst.entity';

@EntityRepository(UserMstEntity)
export class UserMstRepository extends Repository<UserMstEntity> {
   
  }