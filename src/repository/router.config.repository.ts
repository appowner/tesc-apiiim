import { EntityRepository, Repository } from 'typeorm';
import { RouterConfigEntity } from 'src/entity/router.config.entity';

@EntityRepository(RouterConfigEntity)
export class RouterConfigRepository extends Repository<RouterConfigEntity> {

}