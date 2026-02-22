import React from "react";
import Head from "./Head";
import Tag from "./Tag";
import Describe from "./Describe";
import TaskList from "./TaskList"
import "./index.less";

export default function RightSide() {

  return (
    <div className="rightSide">
      <Head />
      <Tag />
      <Describe />
      <TaskList />
    </div>
  );
}
