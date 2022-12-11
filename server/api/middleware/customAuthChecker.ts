import { AuthChecker } from "type-graphql"
import { IUserContext } from "../context/contextType"
import { isAuth } from "../services/user"

const customAuthChecker: AuthChecker<IUserContext> = (
    { context: { userToken, userId } }, _
) => {
    if (!userToken || !userId) {
        return false
    };

    return isAuth(userToken, userId)
        .then(res => res)
        .catch(err => {
            return err
        })
}

export default customAuthChecker