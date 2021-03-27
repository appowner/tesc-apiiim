import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


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
