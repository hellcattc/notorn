import { findUserByIdOrEmail } from "./user";
import { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "../utils/jwt";
import { IdPayload } from "../types/TokenTypes";
import { IUserContext } from "./../context/contextType";
import { CookieOptions, Response } from "express";
import { TokenResponse } from "./../schema/UserTypes";
import { redisClient } from "../../config/connectRedis";
import { signJwt } from "../utils/jwt";
import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
import { ClientError } from "../../errConstants";

dotenv.config();
const accessExpires =
  Date.now() + parseInt(process.env.ACCESS_EXPIRES as string) * 3600 * 1000;
const refreshExpires =
  Date.now() + parseInt(process.env.REFRESH_EXPIRES as string) * 3600 * 1000;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  domain: "localhost",
  sameSite: "strict",
};

const createTokens = <T>(
  payload: T
): Record<keyof TokenResponse | "refreshToken", string> => {
  try {
    const accessToken = signJwt<T>(payload, "ACCESS_PRIVATE", {
      expiresIn: accessExpires,
    } as SignOptions);

    const refreshToken = signJwt<T>(payload, "REFRESH_PRIVATE", {
      expiresIn: refreshExpires,
    } as SignOptions);

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

export const createNewTokens = (
  userid: string,
  res: Response
): TokenResponse => {
  try {
    const { accessToken, refreshToken } = createTokens<IdPayload>({
      inneruserid: userid,
    });

    redisClient.set(refreshToken, accessToken, {
      EX: accessExpires,
    });

    res.cookie("refresh_token", refreshToken, {
      ...cookieOptions,
      maxAge: refreshExpires,
      expires: new Date(Date.now() + refreshExpires),
    });

    return { accessToken };
  } catch (err) {
    throw err;
  }
};

export const obtainAccessToken = async ({
  res,
  req,
}: IUserContext): Promise<TokenResponse> => {
  const refreshToken = req?.cookies["refresh_token"] as string;
  if (!refreshToken) throw ClientError("UNAUTHORIZED");
  const userFromToken = verifyJwt<JwtPayload>(refreshToken, "REFRESH_PUBLIC")
    ?.payload.inneruserid;
  if ((await findUserByIdOrEmail(userFromToken, "inneruserid")) === null)
    throw ClientError("UNAUTHORIZED");
  const accessToken = await redisClient.get(refreshToken);
  if (!accessToken) throw ClientError("UNAUTHORIZED");
  return createNewTokens(userFromToken, res);
};
