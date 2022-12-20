import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import Reservation from './Reservation';
import User from './User';


@Entity()
export default class Order {
  
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date

  @Column({ type: "float"})
  total_price: number

  @Column({ type: "int"})
  status: number

  @OneToMany(() => Reservation, (reservation: Reservation) => reservation.order)
  reservations: Reservation[]

  @ManyToOne(() => User, (user: User) => user.orders)
  @JoinColumn({name: "customer_id"})
  user: User
 


}

