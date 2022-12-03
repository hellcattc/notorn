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
    const privateKey = (process.env[keys[signKey]] as string).replace(/\\n/gm, '\n')

    try {
        return jwt.sign({userid: payload.userid}, privateKey, {
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
    verifyKey: 'accessPublic' | 'refreshPublic',
): T | null => {
    // const publicKey = Buffer.from(process.env[keys[verifyKey]] as string, 'base64').toString('ascii');

    const publicKey = (process.env[keys[verifyKey]] as string).replace(/\\n/gm, '\n')

    try {
        return jwt.verify(token, publicKey.trim(), {
            algorithms: ['RS256']
        }) as T
    } catch (err) {
        console.log('error verifying')
        throw new JsonWebTokenError(err)
    }
}
