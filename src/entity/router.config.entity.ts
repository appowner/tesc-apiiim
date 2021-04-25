import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';



@Entity({name : "router_config"})
  export class RouterConfigEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name : "module_name"})
    moduleName: string;

    @Column({name : "selector"})
    selector: string;

    @Column({name : "redirect_url"})
    redirectUrl: string;

  }