import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { LovValEntity } from './lov-val.entity';

@Entity({ name: "address" })
export class AddressEntity {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    address1:string;   

    @Column()
    address2:string;   

    @Column()
    city:string;   

    @Column()
    state:string;   

    @Column()
    district:string;   

    @Column()
    pincode:string;   

    constructor(){        
       
    }
}
