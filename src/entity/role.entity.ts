import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';



@Entity({ name: "role" })
export class RoleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "description" })
  description: string;

  
  @Column({ name: "key" })
  key: string;

}