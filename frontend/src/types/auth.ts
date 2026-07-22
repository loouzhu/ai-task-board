export interface RegisterUserData {
  username: string;
  password: string;
}

export interface ForgetPasswordUserData {
  username: string;
  password: string;
  newPassword: string;
}
