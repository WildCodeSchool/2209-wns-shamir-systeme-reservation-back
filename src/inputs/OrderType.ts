import { InputType, Field } from "type-graphql";
import UserType from "./UserType";

@InputType()
export class ReservationType {
  @Field()
  created_at: Date

  @Field()
  total_price: number

  @Field()
  status: number

  @Field(type => [ReservationType])
  reservations: [ReservationType]

  @Field(type => UserType)
  user: UserType
}
