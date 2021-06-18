import { EntityRepository, Repository } from 'typeorm';
import { PersonMobileMasterEntity } from 'src/entity/person-mobile-master.entity';
import { EmailMasterEntity } from 'src/entity/email-master.entity';

@EntityRepository(EmailMasterEntity)
export class EmailMasterRepository extends Repository<EmailMasterEntity> {
   
  }