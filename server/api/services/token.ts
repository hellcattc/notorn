import { findUserByIdOrEmail } from './user';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../utils/jwt';
import { IdPayload } from './../types/TokenPayload';
import { IUserContext } from './../context/contextType';
import { CookieOptions, Response } from 'express';
import { TokenResponse } from './../schema/UserTypes';
import { redisClient } from "../../config/connectRedis";
import { signJwt } from '../utils/jwt';
import dotenv from 'dotenv'
import { SignOptions } from 'jsonwebtoken';
import { ClientError } from '../../errConstants'

dotenv.config()
const accessExpires = (parseInt(process.env.ACCESS_EXPIRES as string)*60*1000) 
const refreshExpires = (parseInt(process.env.REFRESH_EXPIRES as string)*60*1000)

const cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: 'localhost',
    sameSite: 'strict'
}

const createTokens = <T>(payload: T): Record<keyof TokenResponse | 'refreshToken', string> => {
    const accessToken = signJwt<T>(
        payload, 
        'ACCESS_PRIVATE', 
        {expiresIn: accessExpires.toString()} as SignOptions
    )

    const refreshToken = signJwt<T>(
        payload,
        'REFRESH_PRIVATE',
        {expiresIn: refreshExpires.toString()} as SignOptions
    )

    return {accessToken, refreshToken}
}

const rotateTokens = (
    userid: string,
    res: Response
): TokenResponse => {
    const { refreshToken, accessToken } = createTokens<IdPayload>({userid})

    redisClient.set(refreshToken, accessToken, {
        EX: accessExpires,
    })

    res.cookie('refresh_token', refreshToken, {
        ...cookieOptions, maxAge: refreshExpires, expires: new Date(Date.now() + refreshExpires)
    })

    return { accessToken }
}

export const tokensOnSignUp = (userid: string, res: Response): TokenResponse => {
    try {
        const { accessToken, refreshToken } = createTokens<IdPayload>({userid})

        redisClient.set(refreshToken, accessToken, {
            EX: accessExpires,
        })

        res.cookie('refresh_token', refreshToken, {
            ...cookieOptions, maxAge: refreshExpires, expires: new Date(Date.now() + refreshExpires)
        })

        return { accessToken }
    } catch (err) {
        throw err
    }
}

export const obtainAccessToken = async ({res, req}: IUserContext): Promise<TokenResponse> => {
    const refreshToken = req?.cookies['refresh_token'] as string
    if (!refreshToken) throw ClientError("UNAUTHORIZED")
    const decoded = verifyJwt<JwtPayload>(refreshToken, 'REFRESH_PUBLIC')
    const userFromToken = decoded?.userId
    if (await findUserByIdOrEmail(userFromToken, 'userid') === null) throw ClientError("UNAUTHORIZED")
    const accessToken = await redisClient.get(refreshToken)
    if (!accessToken) throw ClientError("UNAUTHORIZED")
    return rotateTokens(userFromToken, res)
}