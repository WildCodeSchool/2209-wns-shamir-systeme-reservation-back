import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Category from './Category';
import Reservation from './Reservation';


@Entity()
export default class Product {
  
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar"})
  name: string

  @Column({ type: "text"})
  description: string

  @Column({ type: "text"})
  image: string

  @Column({ type: "float"})
  price: number

  @Column({ type: "int"})
  quantity: number

  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({name: "category_id"})
  category: Category

  @OneToMany(() => Reservation, (reservation: Reservation) => reservation.product, {eager: true })
  reservations: Reservation[]

}

