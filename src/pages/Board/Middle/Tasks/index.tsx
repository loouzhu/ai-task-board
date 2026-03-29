import TaskColumn from "@/components/TaskColumn";
import { status } from "@/constants/common";
import type { task, taskType } from "@/types/task";
import "./index.less";

const COLUMN_ORDER: taskType[] = [
  "pending",
  "processing",
  "testing",
  "completed",
];

interface TasksProps {
  tasks: task[];
}

export default function Tasks({ tasks }: TasksProps) {
  const taskMap = tasks.reduce<Record<taskType, task[]>>(
    (acc, item) => {
      acc[item.taskStatus].push(item);
      return acc;
    },
    {
      pending: [],
      processing: [],
      testing: [],
      completed: [],
    },
  );

  return (
    <div className="middleTasks">
      {COLUMN_ORDER.map((columnStatus) => {
        const columnTasks = taskMap[columnStatus] ?? [];

        return (
          <TaskColumn
            key={columnStatus}
            className={columnStatus}
            columnStatus={columnStatus}
            columnLabel={status[columnStatus]}
            count={columnTasks.length}
            tasks={columnTasks}
          />
        );
      })}
    </div>
  );
}
