import { useGetBoardTasks } from "@/hooks/useTask";
import TaskColumn from "@/components/TaskColumn";
import { status } from "@/constants/common";
import type { task, taskType, taskFilterParams } from "@/types/task";
import "./index.less";
import { useSearchParams } from "react-router-dom";
import { formatData } from "@/utils/common";

const COLUMN_ORDER: taskType[] = [
  "pending",
  "processing",
  "testing",
  "completed",
];

interface TasksProps {
  filterParams: taskFilterParams;
}

export default function Tasks({ filterParams }: TasksProps) {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId") || "";
  const responseData = useGetBoardTasks(boardId)?.data?.tasks as
    | task[]
    | undefined;

  const filteredTasks = (responseData ?? []).filter((item) => {
    const assignee = item.members?.[0] ?? "";

    const matchPrincipal =
      !filterParams.member ||
      filterParams.member === "all" ||
      assignee === filterParams.member;

    const matchPriority =
      !filterParams.taskPriority ||
      filterParams.taskPriority === "all" ||
      item.taskPriority === filterParams.taskPriority;

    const hasDateRange =
      Array.isArray(filterParams.deadlineRange) &&
      filterParams.deadlineRange.length === 2;
    const matchDeadline = !hasDateRange
      ? true
      : (() => {
          const [startDate, endDate] = filterParams.deadlineRange as [
            string,
            string,
          ];
          const deadline = formatData(item.taskDeadline);
          return deadline >= startDate && deadline <= endDate;
        })();

    const keyword = filterParams.keyword?.toLowerCase();
    const matchKeyword = !keyword
      ? true
      : item.taskName.toLowerCase().includes(keyword) ||
        item.taskDescription.toLowerCase().includes(keyword);

    return matchPrincipal && matchPriority && matchDeadline && matchKeyword;
  });

  const taskMap = filteredTasks.reduce<Record<taskType, task[]>>(
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
