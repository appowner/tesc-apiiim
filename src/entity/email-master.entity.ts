import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("email_master_pkey", ["id"], { unique: true })
@Entity("email_master", { schema: "public" })
export class EmailMasterEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "email_master_id" })
  EmailMasterId: number;

  @Column("bigint", { name: "person_id"})
  personId: number | null;
 
  @Column("character varying", { name: "email", length: 200 })
  email: string;

  @Column("boolean", { name: "is_active", nullable: true, default: () => "true" })
  isActive: boolean | null;

  
  @Column("boolean", { name: "is_default", nullable: true, default: () => "true" })
  isDefault: boolean | null;

}
