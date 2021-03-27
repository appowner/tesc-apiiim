import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { LovValEntity } from './lov-val.entity';

@Entity({ name: "lov_mst" })
export class LovMstEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;   

    @Column()
    descr : string;

    @OneToMany(type => LovValEntity, lovValEntity => lovValEntity.lovMst)    
    lovValList : LovValEntity[];

    @Column()
    editable:boolean;

    constructor(){        
       
    }
}
