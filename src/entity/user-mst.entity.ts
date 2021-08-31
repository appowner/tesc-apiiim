import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AddressEntity } from './address.entity';


@Entity({ name: "user_mst" })
export class UserMstEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "user_name" })
  userName: string;

  @Column()
  password: string;

  @Column({ name: "invalid_password_try" })
  invalidPasswordTry: number;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "contact_number" })
  contactNumber: string;

  @Column({ name: "type" })
  type: string;

  @Column("boolean", { name: "active", nullable: true, default: () => "true" })
  active: boolean;

  @Column({ name: "otp" })
  otp: string;

  @Column({ name: "otp_time" })
  otpTime: Date;

  @OneToOne(type => AddressEntity, { cascade: true })
  @JoinColumn({ name: "address_id" })
  address: AddressEntity;

  @Column({ name: "forgot_pass_token" })
  forgotPassToken: string;

  @Column({ name: "forgot_pass_token_exp" })
  forgotPassTokenExp: Date;

  @Column({ name: "role_id" })
  roleId: number;

  @Column({ name: "created_date", nullable: true })
  createdDate: Date | null;

  @Column({ name: "updated_date", nullable: true })
  updatedDate: Date | null;

  @Column({ name: "created_by", nullable: true })
  createdBy: string | null;



}