import { InputType, Field } from "type-graphql";
import Product from "../models/Product";

@InputType()
export class ReservationType {
  @Field()
  start: Date

  @Field()
  end: Date

  @Field()
  price: number

  @Field()
  product : Product
}
