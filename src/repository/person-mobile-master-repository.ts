import { EntityRepository, Repository } from 'typeorm';
import { PersonMobileMasterEntity } from 'src/entity/person-mobile-master.entity';

@EntityRepository(PersonMobileMasterEntity)
export class PersonMobileMasterRepository extends Repository<PersonMobileMasterEntity> {
   
  }