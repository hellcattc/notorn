import jwt, { SignOptions, JsonWebTokenError } from 'jsonwebtoken'
import { IdPayload } from '../types/TokenPayload'
import dotenv from 'dotenv'

dotenv.config()

enum privateKeys {
    "ACCESS_PRIVATE",
    "REFRESH_PRIVATE"
}

enum publicKeys {
    "ACCESS_PUBLIC",
    "REFRESH_PUBLIC"
}

export const signJwt = <T>(
    payload: T,
    signKey: keyof typeof privateKeys,
    options?: SignOptions
) => {
    const privateKey = (process.env[signKey] as string).replace(/\\n/gm, '\n')

    try {
        return jwt.sign({payload}, privateKey, {
            ...options,
            algorithm: 'RS256'
        })
    } catch (err) {
        console.log('error signing')
        console.log(err)
        throw err
    }
} 

export const verifyJwt = <T>(
    token: string,
    verifyKey: keyof typeof publicKeys
): T | null => {
    // const publicKey = Buffer.from(process.env[keys[verifyKey]] as string, 'base64').toString('ascii');

    const publicKey = (process.env[verifyKey] as string).replace(/\\n/gm, '\n')

    try {
        return jwt.verify(token, publicKey.trim(), {
            algorithms: ['RS256']
        }) as T
    } catch (err) {
        console.log('error verifying')
        throw err
    }
}

export const newTokens = <T>() => {

}
