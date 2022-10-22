import { Field, InputType } from "type-graphql";
import {
    Min,
    Max
} from 'class-validator'
import { User } from "../entities/user";

@InputType()
export default class UserInputType implements Partial<User> {
    // @Min(0)
    // @Max(14)
    @Field(type => String, {nullable: true})
    username?: string

    // @Min(6)
    // @Max(24)
    @Field(type => String)
    password!: string
}
