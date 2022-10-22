import { 
    Resolver,
    Mutation,
    Arg,
    Query
 } from "type-graphql";
import { User } from "../entities/user";
import { 
    signUp,
    userProfile 
} from "../methods/userMethods";
import UserInputType from "./userInputType";

@Resolver()
export default class userResolver {

    @Query(returns => User)
    async userProfileAPI(@Arg("user") userId: string) : Promise<User> {
        const reqUser = userProfile(userId)
        return await reqUser
    }

    @Mutation(returns => User)
    async signUpAPI(@Arg("user") newUserData: UserInputType): Promise<User> {
        const newUser = await signUp(newUserData)
        return newUser
    }
}
