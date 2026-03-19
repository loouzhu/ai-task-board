import { Form, Input, Button } from "@arco-design/web-react";
import { useState } from "react";
import { usernameRules, passwordRules } from "@/rules/auth";
import { getTitle } from "@/utils/common";
import { useLogin, useRegister, useChangePwd } from "@/hooks/useAuth";
import "./index.less";

const AuthForm = () => {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const [mode, setMode] = useState<"login" | "register" | "changePwd">("login");
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const changePwdMutation = useChangePwd();

  const handleChangeAuth = () => {
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }
    form.resetFields(); // 切换模式时重置表单
  };

  const handleChangePwd = () => {
    setMode("changePwd");
    form.resetFields();
  };

  // 确认密码验证规则 - 纯前端验证
  const confirmPasswordRules = [
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

  // 处理表单提交
  const handleSubmit = async () => {
    const values = await form.validate();
    const submitData = {
      username: values.username,
      password: values.password,
    };
    const changePwdData = {
      username: values.username,
      password: values.password,
      newPassword: values.newPassword,
    };
    try {
      if (mode === "login") {
        await loginMutation.mutateAsync(submitData);
      } else if (mode === "register") {
        await registerMutation.mutateAsync(submitData);
        setMode("login");
      } else if (mode === "changePwd") {
        await changePwdMutation.mutateAsync(changePwdData);
      }
    } catch (err) {
      console.log("提交表单出现问题", err);
    }
  };

  return (
    <Form
      className="authForm"
      autoComplete="off"
      form={form}
      onSubmit={handleSubmit}
    >
      <h2 className="title">{getTitle(mode)}</h2>

      {/* 用户名字段 */}
      <FormItem label="用户名" field="username" rules={usernameRules}>
        <Input placeholder="请输入用户名" />
      </FormItem>

      {/* 密码字段 */}
      <FormItem label="密码" field="password" rules={passwordRules}>
        <Input.Password placeholder="请输入密码" />
      </FormItem>

      {/* 注册时才显示确认密码字段 */}
      {mode === "register" && (
        <FormItem
          label="确认密码"
          field="confirmPassword"
          rules={confirmPasswordRules}
          dependencies={["password"]} // 当password变化时，重新验证confirmPassword
        >
          <Input.Password placeholder="请再次输入密码" />
        </FormItem>
      )}

      {/* 修改密码时的确认密码 */}
      {mode === "changePwd" && (
        <FormItem label="新密码" field="newPassword" rules={passwordRules}>
          <Input.Password placeholder="请输入新密码" />
        </FormItem>
      )}

      {/* 提交按钮 */}
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={
            loginMutation.isPending ||
            registerMutation.isPending ||
            changePwdMutation.isPending
          }
          long
        >
          {getTitle(mode)}
        </Button>
      </FormItem>

      {/* 底部选项 */}
      <div className="authOption">
        <div className="forgetPsd" onClick={handleChangePwd}>
          {mode === "changePwd" ? "" : "忘记密码?"}
        </div>
        <div className="changeAuth" onClick={handleChangeAuth}>
          {mode === "login" ? "前往注册" : "前往登录"}
        </div>
      </div>
    </Form>
  );
};

export default AuthForm;
