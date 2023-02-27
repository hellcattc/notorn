import { User } from "../entities/User"

export type IdPayload = (
    Pick<User, 'userid'>
)