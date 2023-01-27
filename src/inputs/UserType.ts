import { InputType, Field } from "type-graphql";

@InputType()
export default class userType {
    @Field()
    firstname: string;

    @Field({ nullable: true })
    lastname?: string;

    @Field({ nullable: true })
    phone?: string;

}
