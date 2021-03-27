import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LovMstEntity } from './lov-mst.entity';

@Entity({ name: "lov_val" })
export class LovValEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    active: Boolean;

    @Column()
    name: string;

    @Column()
    value: string;

    @ManyToOne(type => LovMstEntity, lovMstEntity => lovMstEntity.lovValList)
    @JoinColumn({name : 'parent'})
    lovMst: LovMstEntity;

    @Column()
    parent: string;
}
