import { TokenResponse, UserInputType } from '../schema/UserTypes';
import { 
    Resolver,
    Mutation,
    Arg,
    Query,
    Authorized,
    Ctx
 } from "type-graphql";
import { User } from "../entities/user";
import { 
    signUp,
    userProfile 
} from "../services/user";
import { IUserContext } from '../context/contextType';

@Resolver()
export default class UserResolver {

    @Authorized()
    @Query(returns => User)
    async userProfileAPI(@Ctx() ctx: IUserContext) : Promise<User> {
        const reqUser = userProfile(ctx)
        return await reqUser
    }

    @Mutation(returns => TokenResponse)
    async signUpAPI(@Arg("user") newUserData: UserInputType, @Ctx() ctx: IUserContext): Promise<Object> {
        console.log("Error")
        const tokens = await signUp(newUserData, ctx)
        return tokens as TokenResponse
    }
}
