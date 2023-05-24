import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from "typeorm";
import Order from "./Order";
import Role from "./Role";
import { Field, Int, ObjectType } from "type-graphql";

// Creation de la table User
@ObjectType()
@Entity()
export default class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar" })
  firstname: string;

  @Field()
  @Column({ type: "varchar" })
  lastname: string;

  @Field()
  @Column({ type: "varchar" })
  phone: string;

  @Field()
  @Column({ type: "varchar",  unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  token_reset?: string;

  // correspond à la date de réinitialisation du mot de passe
  @Field()
  @Column({ type: "varchar", nullable: true })
  update_reset?: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order: Order) => order.user, { eager: true })
  orders?: Order[];

  @Field(() => [Role])
  @ManyToMany(() => Role)
  @JoinTable({
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];
}
