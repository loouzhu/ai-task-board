export const getTitle = (mode: string) => {
  if (mode === "login") return "登录";
  if (mode === "register") return "注册";
  if (mode === "change-password") return "忘记密码";
  return mode + "错误";
};
