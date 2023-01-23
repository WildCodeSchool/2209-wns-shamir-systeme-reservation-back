import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import Product from './Product';

@ObjectType()
@Entity()
export default class Category {
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id?: number

  @Field()
  @Column({ type: "varchar"})
  name: string

  @Field(() => [Product])
  @OneToMany(() => Product, (product: Product) => product.category, {eager: true})
  products?: Product[]
}

