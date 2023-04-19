import { User } from "./../entities/User";
import { TokenResponse, UserInputType } from "./../schema/UserTypes";
import { IUserContext } from "../context/contextType";
import PGDataSource from "../../config/connectPG";
import * as bcrypt from "bcrypt";
import { signJwt, verifyJwt } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { ClientError } from "../../errConstants";
import { createNewTokens } from "./token";

const userRepository = PGDataSource.getRepository(User);

export const findUserByIdOrEmail = (
  input: string,
  column: Extract<keyof User, "inneruserid" | "email">
): Promise<User | null> => {
  const user = userRepository
    .createQueryBuilder("user")
    .where(`user.${column} = :${column}`)
    .setParameter(`${column}`, `${input}`)
    .getOne();
  return user;
};

export async function signUp(
  input: UserInputType,
  { res }: IUserContext
): Promise<TokenResponse> {
  try {
    const hashedPassword = await bcrypt.hash(input.password as string, 12);
    input.password = hashedPassword;
    const checkUser = await findUserByIdOrEmail(input.email, "email");
    console.log(checkUser);
    if (checkUser !== null) return Promise.reject("User already exists");

    const user = await userRepository.save(userRepository.create(input));
    return createNewTokens(user.inneruserid, res);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function userProfile(userCtx: IUserContext): Promise<User> {
  try {
    return userRepository.findOneBy({
      inneruserid: userCtx.userId,
    }) as Promise<User>;
  } catch (err) {
    console.log("this is err");
    console.log(err);
    throw err;
  }
}

export async function isPresent(
  userToken: string,
  userId: string | undefined
): Promise<void> {
  const expireDate =
    verifyJwt<JwtPayload>(userToken, "ACCESS_PUBLIC")?.exp ?? 0;

  if (Date.now() >= expireDate) {
    throw ClientError("UNAUTHORIZED");
  }

  const user = await userRepository.findOneBy({
    inneruserid: userId,
  });

  if (!user) {
    throw ClientError("UNAUTHORIZED");
  }
}
