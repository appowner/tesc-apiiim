import { EntityRepository, Repository } from 'typeorm';
import { VendorEntity } from 'src/entity/Vendor.entity';


@EntityRepository(VendorEntity)
export class VendorRepository extends Repository<VendorEntity> {
   
  }