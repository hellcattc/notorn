import { obtainAccessToken } from "./../services/token";
import { TokenResponse, UserInputType } from "../schema/UserTypes";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Authorized,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { signUp, userProfile } from "../services/user";
import { IUserContext } from "../context/contextType";
import customAuthChecker from "../middleware/customAuthChecker";

@Resolver()
export default class UserResolver {
  @UseMiddleware(customAuthChecker)
  @Query(() => User)
  async userProfile(@Ctx() ctx: IUserContext): Promise<User> {
    return await userProfile(ctx);
  }

  @Mutation(() => TokenResponse)
  async signUp(
    @Arg("user") newUserData: UserInputType,
    @Ctx() ctx: IUserContext
  ): Promise<TokenResponse> {
    return await signUp(newUserData, ctx);
  }

  @Query(() => TokenResponse)
  async refreshToken(@Ctx() ctx: IUserContext): Promise<TokenResponse> {
    return await obtainAccessToken(ctx);
  }
}
