import { Form, Input, Button } from "@arco-design/web-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";

const AuthForm = () => {
  const FormItem = Form.Item;
  const navigate = useNavigate();
  const [mode, setMode] = useState<string>("login");

  const getTitle = (mode: string) => {
    if (mode === "login") return "登录";
    if (mode === "register") return "注册";
    if (mode === "findPsd") return "修改密码";
    else return mode + "错误";
  };

  const handleChangeAuth = (mode: string) => {
    if (mode === "login") {
      setMode("register");
    } else if (mode === "register" || mode === "findPsd") {
      setMode("login");
    }
  };

  const handleFindPsd = () => {
    setMode("findPsd");
  };

  const handleAuthRedirect = (mode: string) => {
    if (mode === "login") navigate("/");
    else if (mode === "register" || mode === "findPsd") setMode("login");
  };

  return (
    <Form className="authForm" autoComplete="off">
      <h2 className="title">{getTitle(mode)}</h2>
      <FormItem label="用户名" required>
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="密码" required>
        <Input placeholder="请输入密码" />
      </FormItem>
      {!(mode == "login") && (
        <FormItem label="确认密码" required>
          <Input placeholder="请再次输入密码" />
        </FormItem>
      )}
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button type="primary" onClick={() => handleAuthRedirect(mode)}>
          {getTitle(mode)}
        </Button>
      </FormItem>
      <div className="authOption">
        <div className="forgetPsd" onClick={() => handleFindPsd()}>
          {mode === "findPsd" ? "" : "忘记密码?"}
        </div>
        <div className="changeAuth" onClick={() => handleChangeAuth(mode)}>
          {mode === "login" ? "前往注册" : "前往登录"}
        </div>
      </div>
    </Form>
  );
};

export default AuthForm;
