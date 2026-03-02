import React from "react";
import "./index.less";

export default function TaskItem() {
  return (
    <div className="taskItem">
      <div className="name">任务名称</div>
      <div className="priority">高优先级</div>
      <div className="deadline">截止日期</div>
      <div className="else">其他信息</div>
    </div>
  );
}
