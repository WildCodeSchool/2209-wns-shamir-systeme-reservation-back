import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Category from './Category';
import Reservation from './Reservation';

@ObjectType()
@Entity()
export default class Product {
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id?: number

  @Field()
  @Column({ type: "varchar"})
  name: string

  @Field()
  @Column({ type: "text"})
  description: string

  @Field()
  @Column({ type: "text"})
  image: string

  @Field(() => Float)
  @Column({ type: "float"})
  price: number

  @Field(()=> Int)
  @Column({ type: "int"})
  quantity: number

  @Field(()=> Category)
  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({name: "category_id"})
  category: Category

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, (reservation: Reservation) => reservation.product, {eager: true})
  reservations?: Reservation[]

}

