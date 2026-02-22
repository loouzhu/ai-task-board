import { Layout } from "@arco-design/web-react";
import LeftSide from "./Left";
import RightSide from "./Right";
import "./index.less";

export default function Board() {
  const Content = Layout.Content;
  return (
    <Layout className="board">
      <LeftSide />
      <Content>main</Content>
      <RightSide />
    </Layout>
  );
}
