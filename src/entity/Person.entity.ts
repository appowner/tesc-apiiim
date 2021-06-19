import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { EmailMasterEntity } from "./email-master.entity";
import { PersonMobileMasterEntity } from "./person-mobile-master.entity";

@Index("person_pkey", ["id"], { unique: true })
@Entity("person", { schema: "public" })
export class PersonEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string | null;

  @Column("character varying", { name: "title", length: 20 })
  title: string | null;

  @Column("character varying", { name: "photo_id", length: 100 })
  photoId: string | null;

  @Column("bigint", { name: "ref_id"})
  refId: number | null;
 
  @Column("character varying", { name: "ref_type", length: 100 })
  refType: string;


  @Column("boolean", { name: "is_sms_allowed", nullable: true, default: () => "true" })
  isSmsAllowed: boolean | null;

  
  @Column("boolean", { name: "is_notification_allowed", nullable: true, default: () => "true" })
  isNotificationAllowed: boolean | null;

  @Column("boolean", { name: "is_a_user", nullable: true, default: () => "true" })
  isAUser: boolean | null;

  @Column("bigint", { name: "ref_user_id"})
  refUserId: number | null;

  mobileNo: string | null;

  email: string | null;

  emailMasterObj: EmailMasterEntity;

  mobileMasterObj: PersonMobileMasterEntity;
}
