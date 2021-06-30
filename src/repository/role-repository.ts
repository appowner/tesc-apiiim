import { EntityRepository, Repository } from 'typeorm';
import { RoleEntity } from 'src/entity/role.entity';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
   
}