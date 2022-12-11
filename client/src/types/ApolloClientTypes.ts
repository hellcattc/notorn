export type Token = {
    accessToken: string
}

export type UserSignUp = {
    username?: string,
    email: string,
    password: string,
}

export type UserInfo = {
    userProfileAPI: {
        username?: string,
        email: string,
        userid: string
    }
}