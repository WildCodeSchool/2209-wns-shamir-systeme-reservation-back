import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class PaymentSheetType {
    @Field()
    paymentIntentId: string
    @Field()
    ephemeralKeySecret: string
    @Field()
    customer: string
    @Field()
    publishableKey: string
}
