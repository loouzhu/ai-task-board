import { Layout } from "@arco-design/web-react";
import LeftSide from "./Left";
import Middle from "./Middle";
import RightSide from "./Right";
import "./index.less";

export default function Board() {
  return (
    <Layout className="board">
      <LeftSide />
      <Middle />
      <RightSide />
    </Layout>
  );
}
