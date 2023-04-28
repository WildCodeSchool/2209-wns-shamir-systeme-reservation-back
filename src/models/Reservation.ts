import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import Order from "./Order";
import Product from "./Product";

@ObjectType()
@Entity()
export default class Reservation {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  start: Date;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  end: Date;

  @Field()
  @Column({ type: "float" })
  price: number;

  @Field()
  @Column({ type: "int" })
  status: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product: Product) => product.reservations)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Field(() => Order)
  @ManyToOne(() => Order, (order: Order) => order.reservations, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "order_id" })
  order: Order;
}
