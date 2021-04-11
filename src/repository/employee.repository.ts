import { EntityRepository, Repository } from 'typeorm';
import { EmployeeEntity } from 'src/entity/Employee.entity';


@EntityRepository(EmployeeEntity)
export class EmployeeRepository extends Repository<EmployeeEntity> {
   
  }