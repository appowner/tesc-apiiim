import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("driver_pkey", ["id"], { unique: true })
@Entity("driver", { schema: "public" })
export class DriverEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("character varying", { name: "first_name", length: 20 })
  firstName: string;

  @Column("character varying", { name: "last_name", length: 20 })
  lastName: string;

  @Column("character varying", { name: "user_name", length: 100 })
  userName: string;

  @Column("character varying", { name: "company_name", length: 100 })
  companyName: string;

  @Column("character varying", {
    name: "password",
    nullable: true,
    length: 500,
    default: () => "NULL::character varying",
  })
  password: string | null;

  @Column("integer", {
    name: "invalid_password_try",
    nullable: true,
    default: () => "0",
  })
  invalidPasswordTry: number | null;

  @Column("character varying", { name: "email", length: 100 })
  email: string;

  @Column("character varying", { name: "contact_number", length: 15 })
  contactNumber: string;

  @Column("character varying", { name: "otp", nullable: true })
  otp: string | null;

  @Column("timestamp without time zone", { name: "otp_time", nullable: true })
  otpTime: Date | null;

  @Column("boolean", { name: "active", nullable: true, default: () => "false" })
  active: boolean | null;

  @Column("character varying", {
    name: "address",
    nullable: true,
    length: 1000,
    default: () => "NULL::character varying",
  })
  address: string | null;

  @Column("bigint", { name: "user_mst_id"})
  userMstId: number | null;
  
}
