import { useGetBoardTasks } from "@/hooks/useTask";
import TaskColumn from "@/components/TaskColumn";
import { status } from "@/constants/common";
import type { task, taskType } from "@/types/task";
import "./index.less";
import { useSearchParams } from "react-router-dom";

const COLUMN_ORDER: taskType[] = [
  "pending",
  "processing",
  "testing",
  "completed",
];

export default function Tasks() {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId") || "";
  const responseData = useGetBoardTasks(boardId)?.data?.tasks as
    | task[]
    | undefined;

  const taskMap = (responseData ?? []).reduce<Record<taskType, task[]>>(
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
