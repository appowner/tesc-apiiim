import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import {  AddressEntity } from './address.entity';


  @Entity({name : "user_mst"})
  export class UserMstEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name : "first_name"})
    firstName: string;

    @Column({name : "last_name"})
    lastName: string;

    @Column({name : "user_name"})
    userName: string;

    @Column()
    password: string;

    @Column({name : "invalid_password_try"})
    invalidPasswordTry: number;   

    @Column({name : "email"})
    email: string;

    @Column({name : "contact_number"})
    contactNumber: string;

    @Column({name : "type"})
    type: number;

    @Column()
    active: boolean;
    
    @Column({name : "otp"})
    otp: string;    

    @Column({name : "otp_time"})
    otpTime: Date;        

    @OneToOne(type => AddressEntity, { cascade : true })    
    @JoinColumn({name: "address_id"})
    address: AddressEntity;

}