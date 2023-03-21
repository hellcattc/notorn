import { AuthChecker } from "type-graphql";
import { IUserContext } from "../context/contextType";
import { isPresent } from "../services/user";
import { obtainAccessToken } from "../services/token";

const silentAuth = async ({ req, res }: IUserContext) => {
  try {
    console.log("this2");
    await obtainAccessToken({ res, req });
    return true;
  } catch (err) {
    throw err;
  }
};

const customAuthChecker: AuthChecker<IUserContext> = async (
  { context: { userToken, userId, req, res } },
  _
): Promise<boolean> => {
  try {
    if (!userToken || !userId) {
      console.log("this");
      const access = await silentAuth({ req, res });
      console.log(access);
      return access;
    } else {
      return await isPresent(userToken, userId);
    }
  } catch (err) {
    throw err;
  }
};

export default customAuthChecker;
