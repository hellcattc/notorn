import { SignUpResponse } from './../schema/UserTypes';
import { UserContext } from '../../utils/authTools';
import PGDataSource from "../../config/connectPS";
import * as bcrypt from 'bcrypt'
import { User } from "../entities/user";
import { redisClient } from "../../config/connectRedis";
import { signJwt, verifyJwt } from "../../utils/jwt";
import { CookieOptions } from 'express';

const userRepository = PGDataSource.getRepository(User);

const accessExpires = parseInt(process.env.ACCESS_EXPIRES as string)*60*1000
const refreshExpires = parseInt(process.env.REFRESH_EXPIRES as string)*60*1000

const cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: 'localhost',
}

export async function signUp(input: Partial<User>, {res}: UserContext): Promise<Object> {
    const hashedPassword = await bcrypt.hash(input.password as string, 12);
    input.password = hashedPassword;
    if (await userRepository.findOne({
        where: {
            email: input.email}
        })) return Promise.reject("User already exists")

    const userId = (await userRepository.save(userRepository.create(input))).userid
    console.log(userId)
    try {
        const accessToken = signJwt(
            userId, 
            'accessPrivate', 
            // {expiresIn: accessExpires}
        )

        const refreshToken = signJwt(
            userId,
            'refreshPrivate',
            // {expiresIn: refreshExpires}
        )

        redisClient.set(userId, accessToken, {
            EX: accessExpires
        })
        
        res.cookie('access_token', accessToken, {
            ...cookieOptions, maxAge: accessExpires, expires: new Date(Date.now() + accessExpires)
        })

        res.cookie('refresh_token', refreshToken, {
            ...cookieOptions, maxAge: refreshExpires, expires: new Date(Date.now() + refreshExpires)
        })

        return { accessToken, refreshToken } as SignUpResponse
        
    } catch (err) {
        console.log("Here is error")
        return { 1: "shit", 2: "shit"}
    }
}

export async function userProfile(input: string): Promise<User> {
    return userRepository.findOneBy({userid: input}) as Promise<User>
}

export async function isAuth(userToken: string): Promise<Boolean> {
    const decoded = verifyJwt(userToken, 'accessPublic');

    if (!decoded) {
        return false
    }

    const currentSession = await redisClient.get(decoded as string);

    if (!currentSession) {
        return false
    }

    const user = userRepository.findBy({
        userid: currentSession
    })

    if (!user) {
        return false
    }

    return true
}