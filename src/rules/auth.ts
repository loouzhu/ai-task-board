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

// 确认密码验证规则 - 纯前端验证
export const confirmPasswordRules = [
  { required: true, message: "请再次输入密码" },
  {
    validator: (
      value: string | undefined,
      callback: (error?: React.ReactNode) => void,
    ) => {
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不一致");
      } else {
        callback();
      }
    },
  },
];
