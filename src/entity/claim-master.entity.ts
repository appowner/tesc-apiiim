import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityMasterEntity } from './entity-master.entity';



@Entity({ name: "claim_master" })
export class ClaimMasterEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "role_id" })
  roleId: number;

  @Column({ name: "entity_id" })
  entityId: number;

  @Column({ name: "is_read" })
  isRead: boolean;

  @Column({ name: "is_create" })
  isCreate: boolean;

  @Column({ name: "is_update" })
  isUpdate: boolean;

  @Column({ name: "is_delete" })
  isDelete: boolean;

  @Column({ name: "is_purge" })
  isPurge: boolean;

  @Column({ name: "is_export" })
  isExport: boolean;

  @Column({ name: "is_import" })
  isImport: boolean;

  entityMaster : EntityMasterEntity;

}

