import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("person_mobile_master_pkey", ["id"], { unique: true })
@Entity("person_mobile_master", { schema: "public" })
export class PersonMobileMasterEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "mobile_master_id" })
  MobileMasterId: number;

  @Column("bigint", { name: "person_id"})
  personId: number | null;
 
  @Column("character varying", { name: "mobile_no", length: 20 })
  mobileNo: string;

  @Column("boolean", { name: "is_active", nullable: true, default: () => "true" })
  isActive: boolean | null;

  
  @Column("boolean", { name: "is_default", nullable: true, default: () => "true" })
  isDefault: boolean | null;

}
