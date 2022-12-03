type Tokens = {
    accessToken: string,
    refreshToken: string,
}
export type SignResponse = {
    signUpAPI: Tokens
}

export type LoginResponse = {
    loginAPI: Tokens
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