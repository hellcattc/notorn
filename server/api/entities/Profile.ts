import { ObjectType, Field } from "type-graphql";
import { Entity, Generated, PrimaryColumn, Column } from "typeorm";

@ObjectType()
@Entity("profile")
export class Profile {
  @PrimaryColumn()
  @Generated("increment")
  @Field(() => Number)
  outeruserid!: number;

  @Field(() => String)
  @Column({ nullable: true, type: "varchar" })
  alias?: string;

  @Field(() => String)
  @Column({ nullable: true, type: "varchar" })
  name?: string;
}
