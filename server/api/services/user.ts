import { TokenResponse } from './../schema/UserTypes';
import { IUserContext } from '../context/contextType'
import PGDataSource from "../../config/connectPG";
import * as bcrypt from 'bcrypt'
import { User } from "../entities/User";
import { redisClient } from "../../config/connectRedis";
import { signJwt, verifyJwt } from "../utils/jwt";
import { CookieOptions } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as errConstants from '../../errConstants'
import { tokensOnSignUp } from './token';

const userRepository = PGDataSource.getRepository(User);

export const findUserByIdOrEmail = (
    input: string, column: Extract<keyof User, 'userid' | 'email'>
):  Promise<User | null> => {
    const user = userRepository.createQueryBuilder('user')
        .where(`user.${column} = :${column}`)
        .setParameter(`${column}`, `${input}`)
        .getOne()
    return user
}

export async function signUp(input: Partial<User>, {res}: IUserContext): Promise<TokenResponse> {
    try {
        const hashedPassword = await bcrypt.hash(input.password as string, 12);
        input.password = hashedPassword;
        if (await userRepository.findOne({
            where: {
                email: input.email}
            })) return Promise.reject("User already exists")

        const user = await userRepository.save(userRepository.create(input))
        return tokensOnSignUp(user.userid, res)
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export async function userProfile(userCtx: IUserContext): Promise<User> {
    try {
        console.log(userCtx.userId ?? 'no id')
        return userRepository.findOneBy({userid: userCtx.userId}) as Promise<User>
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function isPresent(userToken: string, userId: string | undefined): Promise<boolean> {
    try {
        const expireDate = verifyJwt<JwtPayload>(userToken, 'ACCESS_PUBLIC')?.exp ?? 0;

        const user = await userRepository.findOneBy({
            userid: userId
        })

        if (!user || Date.now() >= expireDate) {
            throw errConstants.ClientError("UNAUTHORIZED")
        }

        return true

    } catch (err) {
        throw err
    }
}