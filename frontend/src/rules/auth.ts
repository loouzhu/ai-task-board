// 用户名验证规则
export const usernameRules = [
  { required: true, message: "请输入用户名" },
  { minLength: 3, message: "用户名至少3个字符" },
  { maxLength: 8, message: "用户名不能超过8个字符" },
];

// 密码验证规则
export const passwordRules = [
  { required: true, message: "请输入密码" },
  { minLength: 6, message: "密码长度不能小于6位" },
  { maxLength: 20, message: "密码长度不能超过20个字符" },
];
