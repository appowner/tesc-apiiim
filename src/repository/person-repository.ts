import { EntityRepository, Repository } from 'typeorm';
import { PersonEntity } from 'src/entity/Person.entity';

@EntityRepository(PersonEntity)
export class PersonRepository extends Repository<PersonEntity> {
   
  }