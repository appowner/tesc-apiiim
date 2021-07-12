import { PersonEntity } from "./Person.entity";

export class VendorPersonAssociationsEntity {

  id: number;

  vendorId: number;

  personId: number ;
 
  isActive: boolean | null;
  
  isDefault: boolean | null;

  isOwner: boolean | null;

  personObj: PersonEntity;
  
}
