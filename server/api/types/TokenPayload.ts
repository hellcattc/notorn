import { User } from "../entities/user"

export type IdPayload = (
    Pick<User, 'userid'>
)