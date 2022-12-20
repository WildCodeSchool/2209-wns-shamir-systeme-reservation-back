import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import Product from './Product';


@Entity()
export default class Category {
  
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar"})
  name: string

  @OneToMany(() => Product, (product: Product) => product.category, {eager: true })
  products: Product[]
}

