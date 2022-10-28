import { AuthChecker } from "type-graphql";
import { Request, Response } from "express"
import { isAuth } from '../api/methods/user.methods';

export interface UserContext {
    req: Request,
    res: Response
    userToken?: string
}

export const contextBuilder = (req: Request, res: Response): UserContext => {
    return {
        req: req,
        res: res,
        //
        userToken: req.cookies?.token ?? 
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split('')[1]) ?? 
        null
        //
    } as UserContext
}

export const customAuthChecker: AuthChecker<UserContext> = (
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