import React from "react";
import "./index.less";
import { Checkbox } from "@arco-design/web-react";

export default function taskList() {
  const taskList = [
    {
      id: 1,
      isDone: false,
      taskName: "前端页面布局",
    },
    {
      id: 2,
      isDone: true,
      taskName: "后端接口调试",
    },
    {
      id: 3,
      isDone: true,
      taskName: "美术UI制作",
    },
    {
      id: 4,
      isDone: true,
      taskName: "美术UI制作",
    },
    {
      id: 6,
      isDone: true,
      taskName: "美术UI制作",
    },
  ];

  return (
    <div className="taskList">
      <div className="title">子任务清单</div>
      <div className="data">
        {taskList &&
          taskList.map((item) => (
            <div key={item.id} className="taskItem">
              <Checkbox checked={item.isDone} />
              <span>{item.taskName}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
