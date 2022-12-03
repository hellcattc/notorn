import { AuthChecker } from "type-graphql"
import { IUserContext } from "../context/contextType"
import { isAuth } from "../methods/user.methods"

const customAuthChecker: AuthChecker<IUserContext> = (
    { context: { userToken } }, _
) => {
    if (!userToken) {
        return false
    };

    return isAuth(userToken)
        .then(res => res)
        .catch(err => {
            return err
        })
}

export default customAuthChecker