import { 
    Length
} from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity('users')
export class User {
    @Field(type => String)
    @PrimaryGeneratedColumn("uuid")
    readonly userid!: string;

    @Field(type => String)
    @PrimaryColumn("varchar")
    email!: string;

    @Field(type => String)
    @Column({nullable: true, type: "varchar"})
    username?: string;

    @Column("varchar")
    password!: string;

    @Column({nullable: true, type: "varchar"})
    accessToken?: string;
}