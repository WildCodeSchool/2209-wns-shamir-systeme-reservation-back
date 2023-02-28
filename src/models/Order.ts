import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Reservation from "./Reservation";
import User from "./User";

@ObjectType()
@Entity()
export default class Order {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @Field()
  @Column({ type: "float" })
  total_price: number;

  @Field()
  @Column({ type: "int" })
  status: number;

  @OneToMany(() => Reservation, (reservation: Reservation) => reservation.order)
  reservations?: Reservation[];

  @ManyToOne(() => User, (user: User) => user.orders)
  @JoinColumn({ name: "customer_id" })
  user: User;
}
