import PGDataSource from "../../config/database";
import * as bcrypt from 'bcrypt'
import { User } from "../entities/user";
import { DeepPartial } from "typeorm";

const userRepository = PGDataSource.getRepository(User);

export async function signUp(input: DeepPartial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password as string, 12);
    input.password = hashedPassword;
    return userRepository.save(userRepository.create(input))
}

export async function userProfile(input: string): Promise<User> {
    return userRepository.findOneBy({userid: input}) as Promise<User>
}