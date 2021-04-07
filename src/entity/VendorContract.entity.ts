import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VendorContractRouteEntity } from "./VendorContractRoute.entity";

@Index("vendor_contract_pkey", ["id"], { unique: true })
@Entity("vendor_contract", { schema: "public" })
export class VendorContractEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("character varying", {name : "name"})
  name : string;

  @Column("date", { name: "start_date" })
  startDate: string;

  @Column("date", { name: "end_date" })
  endDate: string;

  @Column({ type: 'bigint', name: "vendor_id" })
  vendorId: number;

  @OneToMany(
    () => VendorContractRouteEntity,
    (vendorContractRoute) => vendorContractRoute.vendorContract
  )
  vendorContractRoutes: VendorContractRouteEntity[];
}
