import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("vendor_bank_detail_pkey", ["id"], { unique: true })
@Entity("vendor_bank_detail", { schema: "public" })
export class VendorBankDetailEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  

  @Column("character varying", { name: "bank_name", length: 20 })
  bankName: string;

  @Column("character varying", { name: "branch_name", length: 20 })
  branchName: string;

  @Column("character varying", { name: "account_no", length: 20 })
  accountNo: string;

  @Column("character varying", { name: "ifsc_code", length: 20 })
  ifscCode: string;

  @Column({ type: 'bigint', name: "vendor_id" })
  vendorId: number;
  
  

  
}
