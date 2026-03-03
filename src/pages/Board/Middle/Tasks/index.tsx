import React from "react";
import "./index.less";

interface taskColumnProps {
  id: string;
  type: string;
  count: number;
}

export default function Tasks() {
  const columns: taskColumnProps[] = [
    { id: "col_1", type: "waiting", count: 3 },
    { id: "col_2", type: "processing", count: 5 },
    { id: "col_3", type: "testing", count: 2 },
    { id: "col_4", type: "completed", count: 4 },
  ];

  return (
    <div className="middleTasks">
      {columns.map((item) => (
        <div className="taskColumns">
          <div className="status">
            <div className="type">{item.type}</div>
            <div className="count">{item.count}个任务</div>
          </div>
          <div className="taskItems">
            <div className="taskItem">
              <div className="name">任务名称</div>
              <div className="priority">高优先级</div>
              <div className="deadline">截止日期</div>
              <div className="else">其他信息</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
