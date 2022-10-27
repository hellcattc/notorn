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
} from "../methods/user.methods";
import UserInputType from "./InputTypes/UserInputType";
import { UserContext } from "../../utils/authTools"

@Resolver()
export default class UserResolver {

    @Authorized()
    @Query(returns => User)
    async userProfileAPI(@Arg("user") userId: string) : Promise<User> {
        const reqUser = userProfile(userId)
        return await reqUser
    }

    @Mutation(returns => String)
    async signUpAPI(@Arg("user") newUserData: UserInputType, @Ctx() ctx: UserContext): Promise<Object> {
        console.log("Error")
        const tokens = await signUp(newUserData, ctx)
        return tokens
    }
}
