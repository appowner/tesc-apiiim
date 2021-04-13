import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerContractRouteEntity } from "./CustomerContractRoute.entity";

@Index("customer_contract_pkey", ["id"], { unique: true })
@Entity("customer_contract", { schema: "public" })
export class CustomerContractEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column({name : "name"})
  name : string;

  @Column("date", { name: "start_date" })
  startDate: string;

  @Column("date", { name: "end_date" })
  endDate: string;

  @Column({ type: 'bigint', name: "customer_id" })
  customerId: number;

  @Column({name : "advance_payment"})
  advancePayment : string;

  @Column({name : "other_terms"})
  otherTerms : string;

  @OneToMany(
    () => CustomerContractRouteEntity,
    (customerContractRoute) => customerContractRoute.customerContract
  )
  customerContractRoutes: CustomerContractRouteEntity[];
}
