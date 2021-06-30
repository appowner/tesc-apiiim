import { EntityMasterEntity } from 'src/entity/entity-master.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(EntityMasterEntity)
export class EntityMasterRepository extends Repository<EntityMasterEntity> {
   
}