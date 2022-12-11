import { Request, Response } from "express"
import { JwtPayload } from "jsonwebtoken"
import { verifyJwt } from "../utils/jwt"
import { IUserContext } from "../context/contextType"

export const contextBuilder = (req: Request, res: Response): IUserContext => {
    const userToken = (req.cookies?.token ?? 
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split('')[1]) ?? 
    null)
    
    const userId = (userToken !== null) ? verifyJwt<JwtPayload>(userToken, "ACCESS_PUBLIC")?.userid : null

    const contextObject = {
        req,
        res,
        userToken,
        userId
    } as IUserContext

    return contextObject
}
