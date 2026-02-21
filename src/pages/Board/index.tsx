import { Layout } from "@arco-design/web-react";
import "./index.less"

export default function Board() {
  const Sider = Layout.Sider;
  const Content = Layout.Content;
  return (
    <Layout className="board">
      <Sider className="options">111</Sider>
      <Content className="content">222</Content>
    </Layout>
  );
}
