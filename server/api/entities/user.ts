import { Length } from "class-validator";
import { Field, ObjectType, createUnionType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Generated,
} from "typeorm";

@ObjectType()
@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  readonly inneruserid!: string;

  @PrimaryColumn()
  @Generated("increment")
  @Field((type) => Number)
  outeruserid!: number;

  @Field((type) => String)
  @PrimaryColumn("varchar")
  email!: string;

  @Field((type) => String)
  @Column({ nullable: true, type: "varchar" })
  username?: string;

  @Column("varchar")
  password!: string;

  @Column({ nullable: true, type: "varchar" })
  accessToken?: string;
}

type UserResultUnion = User | null;
