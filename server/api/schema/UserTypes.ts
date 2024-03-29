import { Field, InputType, ObjectType } from "type-graphql";
import {
    Length,
    IsEmail
} from 'class-validator'
import { User } from "../entities/User";

@InputType()
export class UserInputType implements Partial<User> {
    @Field(type => String)
    @IsEmail()
    email!: string
    
    @Length(0, 16)
    @Field(type => String, {nullable: true})
    username?: string

    @Length(6,30)
    @Field(type => String)
    password!: string
}

@ObjectType()
export class TokenResponse {   
    @Field(type => String)
    accessToken!: string
}

