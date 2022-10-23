import { 
    Max,
    Min 
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
    // @Min(0)
    // @Max(10)
    username?: string;

    @Column()
    // @Min(6)
    // @Max(30)
    password!: string;
}