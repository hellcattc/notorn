import { AuthChecker } from "type-graphql"
import { IUserContext } from "../context/contextType"
import { isPresent } from "../services/user"
import { obtainAccessToken } from "../services/token"

const silentAuth = async ({req, res}: IUserContext) => {
    try {
        await obtainAccessToken({res, req})
        return true
    } catch (err) {
        throw err
    }
}

const customAuthChecker: AuthChecker<IUserContext> = async (
    { context: { userToken, userId, req, res } }, _
) => {
    if (!userToken || !userId) {
        return await silentAuth({req, res})
    } else {
        try {
            return await isPresent(userToken, userId)
        } catch (err) {
            console.log(err)
            return false
        }

    }
}

export default customAuthChecker