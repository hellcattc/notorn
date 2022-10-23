import { 
    Length
} from 'class-validator';
import { Field, ObjectType, ID } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm'

@ObjectType()
@Entity('users')
export class User {
    @Field(type => String)
    @PrimaryGeneratedColumn("uuid")
    readonly userid!: string;

    @Field(type => String)
    @Column()
    @Length(0, 16)
    username?: string;

    @Column()
    @Length(6,30)
    password!: string;
}