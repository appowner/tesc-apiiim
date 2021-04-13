import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerContractEntity } from "./CustomerContract.entity";

@Index("customer_contract_route_pkey", ["id"], { unique: true })
@Entity("customer_contract_route", { schema: "public" })
export class CustomerContractRouteEntity {
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

  @Column("character varying", { name: "consigner", length: 100 })
  consigner: string;

  @Column("character varying", { name: "consignee", length: 100 })
  consignee: string;

  @Column("character varying", { name: "other_terms", length: 100 })
  otherTerms: string;

  @ManyToOne(
    () => CustomerContractEntity,
    (customerContract) => customerContract.customerContractRoutes
  )
  @JoinColumn([{ name: "customer_contract_id", referencedColumnName: "id" }])
  customerContract: CustomerContractEntity;
}
