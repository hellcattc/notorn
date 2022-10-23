import PGDataSource from "../../config/database";
import * as bcrypt from 'bcrypt'
import { User } from "../entities/user";

const userRepository = PGDataSource.getRepository(User);

export async function signUp(input: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password as string, 12);
    input.password = hashedPassword;
    if (await userRepository.findOne({where: {email: input.email}})) {
        return Promise.reject("User already exists")
    }
    return userRepository.save(userRepository.create(input))
}

export async function userProfile(input: string): Promise<User> {
    return userRepository.findOneBy({userid: input}) as Promise<User>
}