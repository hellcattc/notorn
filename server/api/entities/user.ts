import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Generated,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Profile } from "./Profile";
import { UserRolesValues } from "../types/UserResolverTypes";

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
  role?: UserRolesValues;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile!: Profile;
}

type UserResultUnion = User | null;
