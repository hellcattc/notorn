import jwt, { SignOptions } from 'jsonwebtoken'
require('dotenv').config()

const keys = {
    accessPrivate: "ACCESS_PRIVATE",
    refreshPrivate: "REFRESH_PRIVATE",
    accessPublic: "ACCESS_PUBLIC",
    refreshPublic: "ACCESS_PRIVATE"
}

export const signJwt = (
    payload: Object,
    signKey: 'accessPrivate' | 'refreshPrivate',
    options?: SignOptions
) => {
    const privateKey = Buffer.from(process.env[keys[signKey]] as string, 'base64').toString('ascii');

    return jwt.sign(payload, privateKey, {
        ...options,
        algorithm: 'RS256',
    })
} 

export const verifyJwt = <T>(
    token: string,
    verifyKey: 'accessPublic' | 'refreshPublic',
): T | null => {
    const publicKey = Buffer.from(process.env[keys[verifyKey]] as string, 'base64').toString('ascii');
    try {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        }) as T
    } catch (err) {
        return null
    }
}
