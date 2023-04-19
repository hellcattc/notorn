import { IdPayload } from "../types/TokenTypes";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "../utils/jwt";
import { IUserContext } from "../context/contextType";
import { ContextFunction } from "@apollo/server";

export const contextBuilder = async (
  req: Request,
  res: Response
): Promise<IUserContext> => {
  try {
    const userToken =
      req.cookies?.access_token ??
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]) ??
      null;

    const userId =
      userToken !== null
        ? verifyJwt<JwtPayload>(userToken, "ACCESS_PUBLIC")?.payload.inneruserid
        : null;

    const contextObject = {
      req,
      res,
      userToken,
      userId,
    } as IUserContext;

    return contextObject;
  } catch (err) {
    throw err;
  }
};
