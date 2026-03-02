import React from "react";
import TaskItem from "../TaskItem";
import "./index.less"

interface taskColumnProps {
  type: string;
  count: number;
}

export default function TaskColumn({ type, count }: taskColumnProps) {
  return (
    <div className="taskColumn">
      <div className="status">
        <div className="type">{type}</div>
        <div className="count">{count}个任务</div>
      </div>
      <div className="taskItems">
        <TaskItem />
      </div>
    </div>
  );
}
