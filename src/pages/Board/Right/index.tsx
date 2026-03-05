import { Layout } from "@arco-design/web-react";
import Head from "./Head";
import Tag from "./Tag";
import Describe from "./Describe";
import TaskList from "./TaskList";
import Attachment from "./Attachment";
import "./index.less";

export default function RightSide() {
  const Sider = Layout.Sider;
  return (
    <Sider className="rightSide">
      <div className="content">
        <Head />
        <Tag />
        <Describe />
        <TaskList />
        <Attachment />
      </div>
    </Sider>
  );
}
