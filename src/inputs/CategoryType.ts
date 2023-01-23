import { InputType, Field } from "type-graphql";
import { ProductType } from "./ProductType";

@InputType()
export class CategoryType {

  @Field()
  id: number

  @Field()
  name: string

}
