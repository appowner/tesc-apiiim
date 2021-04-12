import { EntityRepository, Repository } from 'typeorm';
import { DriverEntity } from 'src/entity/Driver.entity';


@EntityRepository(DriverEntity)
export class DriverRepository extends Repository<DriverEntity> {
   
  }