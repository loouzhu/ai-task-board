import type { task, taskType } from "@/types/task";
import { Empty, Message, Modal,Form } from "@arco-design/web-react";
import { useSearchParams } from "react-router-dom";
import { IconPlus } from "@arco-design/web-react/icon";
import { useAddTask } from "@/hooks/useTask";
import TaskItem from "../TaskItem";
import "./index.less";

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
  //const [searchParams] = useSearchParams();
  //const boardId = searchParams.get("boardId") || "";

  const handleAddTask = (status: taskType) => {
    Message.info(`添加任务到状态: ${status}`);
  };

  return (
    <div className={`taskColumns ${className}`} key={columnStatus}>
      {/* 列头 */}
      <div className="status">
        <div className="left">
          <div className="type">{columnLabel ?? columnStatus}</div>
          <IconPlus onClick={() => handleAddTask(columnStatus)} />
        </div>
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
