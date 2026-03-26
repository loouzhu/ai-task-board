export const getTitle = (mode: string) => {
  if (mode === "login") return "登录";
  if (mode === "register") return "注册";
  if (mode === "change-password") return "忘记密码";
  return mode + "错误";
};

// 日期处理
export const formatData = (date: string | Date) => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(targetDate.getTime())) {
    return "";
  }

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
