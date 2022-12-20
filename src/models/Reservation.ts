import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Order from './Order';
import Product from './Product';


@Entity()
export default class Reservation {
  
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: "timestamp"})
  start: Date

  @CreateDateColumn({ type: "timestamp"})
  end: Date

  @Column({ type: "float"})
  price: number

  @Column({ type: "int"})
  status: number

  @ManyToOne(() => Product, (product: Product) => product.reservations)
  @JoinColumn({name: "product_id"})
  product: Product

  @ManyToOne(() => Order, (order: Order) => order.reservations, {eager: true })
  @JoinColumn({name: "order_id"})
  order: Order

}

