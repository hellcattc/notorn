import { obtainAccessToken } from "./../services/token";
import { TokenResponse, UserInputType } from "../schema/UserTypes";
import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { User } from "../entities/User";
import { signUp, userProfile } from "../services/user";
import { IUserContext } from "../context/contextType";

@Resolver()
export default class UserResolver {
  @Authorized()
  @Query(() => User)
  async userProfileAPI(@Ctx() ctx: IUserContext): Promise<User | null> {
    const reqUser = userProfile(ctx);
    return await reqUser;
  }

  @Mutation(() => TokenResponse)
  async signUpAPI(
    @Arg("user") newUserData: UserInputType,
    @Ctx() ctx: IUserContext
  ): Promise<TokenResponse> {
    const tokens = await signUp(newUserData, ctx);
    return tokens as TokenResponse;
  }

  @Query(() => TokenResponse)
  async getAccessToken(@Ctx() ctx: IUserContext): Promise<TokenResponse> {
    const tokens = await obtainAccessToken(ctx);
    return tokens;
  }
}
