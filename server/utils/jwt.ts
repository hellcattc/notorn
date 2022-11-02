import jwt, { SignOptions, JsonWebTokenError } from 'jsonwebtoken'
import { User } from '../api/entities/user';
import { userProfile } from '../api/methods/user.methods';
require('dotenv').config()

const keys = {
    accessPrivate: "ACCESS_PRIVATE",
    refreshPrivate: "REFRESH_PRIVATE",
    accessPublic: "ACCESS_PUBLIC",
    refreshPublic: "ACCESS_PRIVATE"
}

export const signJwt = (
    payload: User,
    signKey: 'accessPrivate' | 'refreshPrivate',
    options?: SignOptions
) => {
    const privateKey = Buffer.from(process.env[keys[signKey]] as string, 'base64').toString('utf-8');

    try {
        return jwt.sign({userid: payload.userid}, privateKey.trim(), {
            ...options,
            algorithm: 'HS256',
            subject: payload.email,
        })
    } catch (err) {
        throw new JsonWebTokenError(err)
    }
} 

export const verifyJwt = <T>(
    token: string,
    verifyKey: 'accessPublic' | 'refreshPublic',
): T | null => {
    const publicKey = Buffer.from(process.env[keys[verifyKey]] as string, 'base64').toString('ascii');
    try {
        return jwt.verify(token, publicKey.trim(), {
            algorithms: ['HS256']
        }) as T
    } catch (err) {
        throw new JsonWebTokenError(err)
    }
}
