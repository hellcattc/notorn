export interface Token {
  accessToken: string
}

export interface UserSignUp {
  username?: string
  email: string
  password: string
}

export interface UserInfo {
  userProfileAPI: {
    username?: string
    email: string
    userid: string
  }
}
