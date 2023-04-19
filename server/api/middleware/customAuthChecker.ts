import { MiddlewareFn } from "type-graphql";
import { IUserContext } from "../context/contextType";
import { isPresent } from "../services/user";
import { GraphQLError } from "graphql";
import { ClientError, constantErrorTypes } from "../../errConstants";

const customAuthChecker: MiddlewareFn<IUserContext> = async (
  { context: { userToken, userId } },
  next
) => {
  try {
    if (!userToken || !userId) {
      throw ClientError("UNAUTHORIZED");
    } else {
      await isPresent(userToken, userId);
      return next();
    }
  } catch (err) {
    throw new GraphQLError(constantErrorTypes.UNAUTHORIZED.message, {
      extensions: { code: constantErrorTypes.UNAUTHORIZED.statusCode },
    });
  }
};

export default customAuthChecker;
