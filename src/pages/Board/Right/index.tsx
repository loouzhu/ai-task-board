import React from "react";
import { Layout } from "@arco-design/web-react";
import Head from "./Head";
import Tag from "./Tag";
import Describe from "./Describe";
import TaskList from "./TaskList";
import "./index.less";

export default function RightSide() {
  const Sider = Layout.Sider;
  return (
    <Sider className="rightSide">
      <Head />
      <Tag />
      <Describe />
      <TaskList />
    </Sider>
  );
}
