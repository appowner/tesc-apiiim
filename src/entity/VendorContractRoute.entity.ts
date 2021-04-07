import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VendorContractEntity } from "./VendorContract.entity";

@Index("vendor_contract_route_pkey", ["id"], { unique: true })
@Entity("vendor_contract_route", { schema: "public" })
export class VendorContractRouteEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("character varying", { name: "from_city", length: 100 })
  fromCity: string;

  @Column("character varying", { name: "from_state", length: 100 })
  fromState: string;

  @Column("character varying", { name: "to_city", length: 100 })
  toCity: string;

  @Column("character varying", { name: "to_state", length: 100 })
  toState: string;

  @Column("character varying", { name: "truck_type", length: 100 })
  truckType: string;

  @Column("integer", { name: "transit_time" })
  transitTime: number;

  @Column("character varying", { name: "advance_payment", length: 100 })
  advancePayment: string;

  @Column("character varying", { name: "other_terms", length: 100 })
  otherTerms: string;

  @ManyToOne(
    () => VendorContractEntity,
    (vendorContract) => vendorContract.vendorContractRoutes
  )
  @JoinColumn([{ name: "vendor_contract_id", referencedColumnName: "id" }])
  vendorContract: VendorContractEntity;
}
