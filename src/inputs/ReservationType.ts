import { InputType, Field } from "type-graphql";
import { CategoryType } from "./CategoryType";

@InputType()
class ProductOrder {
  @Field()
  id: number
  @Field()
  name: string
  @Field()
  description: string
  @Field()
  image: string
  @Field()
  price: number
  @Field()
  quantity: number
  @Field()
  category: CategoryType
}

@InputType()
export class ReservationType {
  @Field()
  start: Date

  @Field()
  end: Date

  @Field()
  price: number

  @Field(type => ProductOrder)
  product: ProductOrder
}
