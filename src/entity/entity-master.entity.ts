import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: "entity_master" })
export class EntityMasterEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "description" })
  description: string;

  @Column({ name: "is_active" })
  isActive: boolean;

  @Column({ name: "group_name" })
  groupName: string;

}