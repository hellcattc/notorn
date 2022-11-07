interface Tokens {
    accessToken: string,
    refreshToken: string,
}
export interface SignResponse {
    signUpAPI: Tokens
}

export interface LoginResponse {
    loginAPI: Tokens
}

export interface UserSignUp {
    username?: string,
    email: string,
    password: string,
}