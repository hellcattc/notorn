import { AuthChecker } from "type-graphql";
import { IUserContext } from "../context/contextType";
import { isPresent } from "../services/user";
import { obtainAccessToken } from "../services/token";
import { GraphQLError } from "graphql";
import { constantErrorTypes } from "../../errConstants";

const silentAuth = async ({ req, res }: IUserContext) => {
  try {
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
      const access = await silentAuth({ req, res });
      return access;
    } else {
      return await isPresent(userToken, userId);
    }
  } catch (err) {
    throw new GraphQLError(constantErrorTypes.UNAUTHORIZED.message, {
      extensions: { code: constantErrorTypes.UNAUTHORIZED.statusCode },
    });
  }
};

export default customAuthChecker;
