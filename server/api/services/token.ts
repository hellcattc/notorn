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
    {accessToken, refreshToken}: Record<keyof TokenResponse | 'refreshToken', string>,
    res: Response
): void => {
    redisClient.set(refreshToken, JSON.stringify(accessToken), {
        EX: accessExpires,
    })

    res.cookie('refresh_token', refreshToken, {
        ...cookieOptions, maxAge: refreshExpires, expires: new Date(Date.now() + refreshExpires)
    })
}

export const tokensOnSignUp = (userid: string, res: Response): TokenResponse => {
    try {
        const { accessToken, refreshToken } = createTokens(userid)

        redisClient.set(refreshToken, JSON.stringify(accessToken), {
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

export const obtainAccessToken = async ({res, req, userId}: IUserContext): Promise<void> => {
    const refreshToken = req?.cookies['refresh_token'] as string
    if (!refreshToken) throw ClientError("UNAUTHORIZED")
    const decoded = verifyJwt(refreshToken, 'REFRESH_PUBLIC')
    
    const accessToken = await redisClient.get(refreshToken) 
    if (!accessToken) throw ClientError("UNAUTHORIZED")
    rotateTokens(createTokens(userId), res)
}