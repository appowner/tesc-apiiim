
import { ClaimMasterEntity } from 'src/entity/claim-master.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ClaimMasterEntity)
export class ClaimMasterRepository extends Repository<ClaimMasterEntity> {
   
}