import { SignUpResponse } from './../schema/UserTypes';
import { UserContext } from '../../utils/authTools';
import PGDataSource from "../../config/connectPS";
import * as bcrypt from 'bcrypt'
import { User } from "../entities/user";
import { redisClient } from "../../config/connectRedis";
import { signJwt, verifyJwt } from "../../utils/jwt";
import { CookieOptions } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as errConstants from '../../errConstants'

const userRepository = PGDataSource.getRepository(User);

const accessExpires = parseInt(process.env.ACCESS_EXPIRES as string)*60*1000
const refreshExpires = parseInt(process.env.REFRESH_EXPIRES as string)*60*1000

const cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: 'localhost',
    sameSite: 'strict'
}

export async function signUp(input: Partial<User>, {res}: UserContext): Promise<Object> {
    const hashedPassword = await bcrypt.hash(input.password as string, 12);
    input.password = hashedPassword;
    if (await userRepository.findOne({
        where: {
            email: input.email}
        })) return Promise.reject("User already exists")

    const user = await userRepository.save(userRepository.create(input))
    console.log(user)
    try {
        const accessToken = signJwt(
            user, 
            'accessPrivate', 
            {expiresIn: accessExpires}
        )

        const refreshToken = signJwt(
            user,
            'refreshPrivate',
            {expiresIn: refreshExpires}
        )

        const tokens = { accessToken, refreshToken } as SignUpResponse

        redisClient.set(refreshToken, JSON.stringify(tokens), {
            EX: accessExpires,
        })

        res.cookie('refresh_token', refreshToken, {
            ...cookieOptions, maxAge: refreshExpires, expires: new Date(Date.now() + refreshExpires)
        })

        return { accessToken, refreshToken } as SignUpResponse

    } catch (err) {
        throw err
    }
}

export async function userProfile(input: string): Promise<User> {
    return userRepository.findOneBy({userid: input}) as Promise<User>
}

export async function isAuth(userToken: string): Promise<Boolean> {
    const decoded = verifyJwt<JwtPayload>(userToken, 'accessPublic');

    const id = decoded?.sub ?? null

    if (!id) {
        return false
    }

    const user = await userRepository.findOneBy({
        userid: id
    })

    if (!user) {
        return false
    }   

    if (user.accessToken != userToken) {
        throw errConstants.ClientError("UNAUTHORIZED")
    }

    return true
}