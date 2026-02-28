import { Form, Input, Button, Message } from "@arco-design/web-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "@/api/auth";
import "./index.less";

const AuthForm = () => {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "findPsd">("login");
  const [loading, setLoading] = useState<boolean>(false);

  const getTitle = (mode: string) => {
    if (mode === "login") return "登录";
    if (mode === "register") return "注册";
    if (mode === "findPsd") return "修改密码";
    return mode + "错误";
  };

  const handleChangeAuth = () => {
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }
    form.resetFields(); // 切换模式时重置表单
  };

  const handleFindPsd = () => {
    setMode("findPsd");
    form.resetFields();
  };

  // 用户名验证规则
  const usernameRules = [
    { required: true, message: "请输入用户名" },
    { minLength: 3, message: "用户名至少3个字符" },
    { maxLength: 20, message: "用户名不能超过20个字符" },
  ];

  // 密码验证规则
  const passwordRules = [
    { required: true, message: "请输入密码" },
    { minLength: 6, message: "密码长度不能小于6位" },
  ];

  // 确认密码验证规则 - 纯前端验证
  const confirmPasswordRules = [
    { required: true, message: "请再次输入密码" },
    {
      validator: (
        value: string | undefined,
        callback: (error?: React.ReactNode) => void
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
    try {
      // 1. 前端验证所有字段
      const values = await form.validate();

      // 2. 验证通过后，准备发送到后端的数据
      //    注意：只发送 username 和 password，不发送 confirmPassword
      const submitData = {
        username: values.username,
        password: values.password,
      };

      console.log("提交到后端的数据:", submitData); // { username: 'xxx', password: 'xxx' }

      // 3. 设置加载状态
      setLoading(true);

      // 4. 根据不同模式调用不同接口
      let response;
      if (mode === "login") {
        // 调用登录接口
        response = await login(submitData);
        if (response.status===200) {
          Message.success("登录成功！");
          // 存储token
          // localStorage.setItem("token", response);
          navigate("/board");
        }
      } else if (mode === "register") {
        // 调用注册接口 - 只传 username 和 password
        response = await register(submitData);
        if (response.status===200) {
          Message.success("注册成功！请登录");
          setMode("login");
          form.resetFields();
        }
      } else if (mode === "findPsd") {
        Message.info("修改密码功能开发中");
        setMode("login");
        form.resetFields();
      }
    } catch (error) {
      // 表单验证失败，不会请求后端
      console.log("表单验证失败", error);
      Message.warning("请正确填写表单信息");
    } finally {
      setLoading(false);
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

      {/* 修改密码时的确认密码（如果有这个功能） */}
      {mode === "findPsd" && (
        <FormItem label="新密码" field="newPassword" rules={passwordRules}>
          <Input.Password placeholder="请输入新密码" />
        </FormItem>
      )}

      {/* 提交按钮 */}
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button type="primary" onClick={handleSubmit} loading={loading} long>
          {getTitle(mode)}
        </Button>
      </FormItem>

      {/* 底部选项 */}
      <div className="authOption">
        <div className="forgetPsd" onClick={handleFindPsd}>
          {mode === "findPsd" ? "" : "忘记密码?"}
        </div>
        <div className="changeAuth" onClick={handleChangeAuth}>
          {mode === "login" ? "前往注册" : "前往登录"}
        </div>
      </div>
    </Form>
  );
};

export default AuthForm;
