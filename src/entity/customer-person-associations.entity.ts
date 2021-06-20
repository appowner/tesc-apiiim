import { PersonEntity } from "./Person.entity";

export class CustomerPersonAssociationsEntity {

  id: number;

  customerId: number;

  personId: number ;
 
  isActive: boolean | null;
  
  isDefault: boolean | null;

  isOwner: boolean | null;

  personObj: PersonEntity;
  
}
