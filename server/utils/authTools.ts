import { JwtPayload } from 'jsonwebtoken';
import { AuthChecker } from "type-graphql";
import { Request, Response } from "express"
import { isAuth } from '../api/methods/user.methods';
import { verifyJwt } from "./jwt";
import { CannotAttachTreeChildrenEntityError } from 'typeorm';
export interface IUserContext {
    req: Request
    res: Response
    userToken?: string,
    userId?: string,
}

export const contextBuilder = (req: Request, res: Response): IUserContext => {
    try {
        const userToken = (req.cookies?.token ?? 
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split('')[1]) ?? 
        null)

        console.log(req.cookies)

        const userId = (userToken !== null) ? verifyJwt<JwtPayload>(userToken, "accessPublic")?.sub : null

        const contextObject = {
            req,
            res,
            userToken,
            userId
        } as IUserContext

        console.log(contextObject.userToken, contextObject.userId)

        return contextObject
    } catch (err) {
        console.log(err) 
        return {
            req, 
            res
        }
    }
}

export const customAuthChecker: AuthChecker<IUserContext> = (
    { context: { userToken } }, _
) => {
    if (!userToken) {
        return false
    };

    return isAuth(userToken)
        .then(res => res)
        .catch(err => {
            console.log(err)
            return err
        })
}