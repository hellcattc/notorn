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
    const privateKey = Buffer.from(process.env[keys[signKey]] as string, 'base64').toString('utf-8');

    try {
        return jwt.sign(payload, privateKey.trim(), {
            ...options,
            algorithm: 'HS256',
        })
    } catch (err) {
        console.log('wtf')
        return 'nothing happens'
    }
} 

export const verifyJwt = <T>(
    token: string,
    verifyKey: 'accessPublic' | 'refreshPublic',
): T | null => {
    const publicKey = Buffer.from(process.env[keys[verifyKey]] as string, 'base64').toString('ascii');
    try {
        return jwt.verify(token, publicKey.trim(), {
            algorithms: ['RS256']
        }) as T
    } catch (err) {
        return null
    }
}
