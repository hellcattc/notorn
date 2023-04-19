export interface Token {
  accessToken: string;
}

export interface UserSignUp {
  username?: string;
  email: string;
  password: string;
}

export interface UserInfo {
  userProfile: {
    username?: string;
    email: string;
    outeruserid: string;
  };
}
