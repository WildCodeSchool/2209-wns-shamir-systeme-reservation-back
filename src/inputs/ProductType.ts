import { InputType, Field } from "type-graphql";
import { CategoryType } from "./CategoryType";

@InputType()
export class ProductType {
  @Field()
  name: string

  @Field()
  description: string

  @Field({ nullable: true })
  image: string

  @Field()
  price: number

  @Field()
  quantity: number

  @Field(type => CategoryType)
  category: CategoryType
}
