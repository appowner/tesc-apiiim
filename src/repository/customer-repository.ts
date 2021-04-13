import { EntityRepository, Repository } from 'typeorm';
import { CustomerEntity } from 'src/entity/Customer.entity';


@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {
   
  }