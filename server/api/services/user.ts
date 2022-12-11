import { TokenResponse } from './../schema/UserTypes';
import { IUserContext } from '../context/contextType'
import PGDataSource from "../../config/connectPG";
import * as bcrypt from 'bcrypt'
import { User } from "../entities/user";
import { redisClient } from "../../config/connectRedis";
import { signJwt, verifyJwt } from "../utils/jwt";
import { CookieOptions } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as errConstants from '../../errConstants'
import { tokensOnSignUp } from './token';

const userRepository = PGDataSource.getRepository(User);

const cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: 'localhost',
    sameSite: 'strict'
}

export const findUser = async (input: string, column: Exclude<keyof User, 'userid' | 'email'>) => {
    // const user = await userRepository.findOneBy({column: input})
}

export async function signUp(input: Partial<User>, {res}: IUserContext): Promise<TokenResponse> {
    const hashedPassword = await bcrypt.hash(input.password as string, 12);
    input.password = hashedPassword;
    if (await userRepository.findOne({
        where: {
            email: input.email}
        })) return Promise.reject("User already exists")

    const user = await userRepository.save(userRepository.create(input))
    
    return tokensOnSignUp(user.userid, res)
}

export async function userProfile(userCtx: IUserContext): Promise<User> {
    return userRepository.findOneBy({userid: userCtx.userId}) as Promise<User>
}

export async function isAuth(userToken: string, userId: string | undefined): Promise<Boolean> {
    try {
        const decoded = verifyJwt<JwtPayload>(userToken, 'ACCESS_PUBLIC');

        const user = await userRepository.findOneBy({
            userid: userId
        })

        if (!user || decoded?.exp) {
            throw errConstants.ClientError("UNAUTHORIZED")
        }

        return true

    } catch (err) {
        console.log(err)
        throw err
    }
}