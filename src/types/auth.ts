export interface RegisterUserData {
  username: string;
  password: string;
}

export interface ChangePwdUserData {
  username: string;
  password: string;
  newPassword: string;
}
