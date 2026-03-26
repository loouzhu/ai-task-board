import type { task, taskType } from "@/types/task";
import TaskItem from "../TaskItem";
import "./index.less";
import { Empty } from "@arco-design/web-react";

interface taskColumnProp {
  className?: string;
  columnStatus: taskType;
  columnLabel?: string;
  count: number;
  tasks: task[];
}

export default function TaskColumn({
  className = "",
  columnStatus,
  columnLabel,
  count = 0,
  tasks = [],
}: taskColumnProp) {
  return (
    <div className={`taskColumns ${className}`} key={columnStatus}>
      {/* 列头 */}
      <div className="status">
        <div className="type">{columnLabel ?? columnStatus}</div>
        <div className="count">{count}个任务</div>
      </div>

      {/* 任务列表 */}
      {tasks.length > 0 ? (
        <div className="taskItems">
          {tasks.map((task) => (
            <TaskItem key={task.taskId} task={task} />
          ))}
        </div>
      ) : (
        <Empty description="暂无任务" />
      )}
    </div>
  );
}
