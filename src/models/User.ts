import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import Order from './Order';
import Role from './Role';


@Entity()
export default class User {
  
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar"})
  firstname: string

  @Column({ type: "varchar"})
  lastname: string

  @Column({ type: "int"})
  phone: number

  @Column({ type: "varchar"})
  email: string

  @Column({ type: "varchar"})
  password: string
 
  @OneToMany(() => Order, (order: Order) => order.user, {eager: true })
  orders: Order[]

  @ManyToMany(() => Role)
  @JoinTable({
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[]
}

