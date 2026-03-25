import { status, type StatusType } from "@/constants/common";
import { useGetBoardTasks } from "@/hooks/useTask";
import TaskItem from "@/components/TaskItem";
import "./index.less";
import { useSearchParams } from "react-router-dom";

interface ColumnProps {
  id: string;
  type: StatusType;
  count: number;
}

interface Task {
  id: number;
  name: string;
  priority: string;
  deadline: string;
  info?: string;
}

export default function Tasks() {
  // 列配置
  const columns: ColumnProps[] = [
    { id: "col_1", type: "pending", count: 3 },
    { id: "col_2", type: "processing", count: 5 },
    { id: "col_3", type: "testing", count: 2 },
    { id: "col_4", type: "completed", count: 4 },
  ];

  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId") || "";
  const tasks = useGetBoardTasks(boardId).data;
  console.log(tasks, "tasks");

  // 任务数据 - 按列分组
  const taskItems = [
    {
      columnType: "pending",
      tasks: [
        {
          id: 1,
          name: "实现登录功能",
          priority: "high",
          deadline: "2026-01-01",
        },
        {
          id: 2,
          name: "修复注册bug",
          priority: "high",
          deadline: "2026-01-01",
        },
      ],
    },
    {
      columnType: "processing",
      tasks: [
        {
          id: 3,
          name: "开发看板页面",
          priority: "high",
          deadline: "2026-01-01",
        },
        {
          id: 4,
          name: "对接API接口",
          priority: "high",
          deadline: "2026-01-01",
        },
      ],
    },
    {
      columnType: "testing",
      tasks: [
        {
          id: 11,
          name: "测试拖拽功能",
          priority: "high",
          deadline: "2026-01-01",
        },
        {
          id: 21,
          name: "测试响应式",
          priority: "high",
          deadline: "2026-01-01",
        },
      ],
    },
    {
      columnType: "completed",
      tasks: [
        {
          id: 31,
          name: "项目初始化",
          priority: "high",
          deadline: "2026-01-01",
        },
        {
          id: 41,
          name: "搭建脚手架",
          priority: "high",
          deadline: "2026-01-01",
        },
      ],
    },
  ];

  // 辅助函数：根据列类型获取对应的任务列表
  const getTasksByColumnType = (columnType: string): Task[] => {
    const column = taskItems.find((item) => item.columnType === columnType);
    return column ? column.tasks : [];
  };

  return (
    <div className="middleTasks">
      {columns.map((column) => {
        const tasks = getTasksByColumnType(column.type);

        return (
          <div key={column.id} className={`taskColumns ${column.type}`}>
            {/* 列头 */}
            <div className="status">
              <div className="type">{status[column.type]}</div>
              <div className="count">{column.count}个任务</div>
            </div>

            {/* 任务列表 */}
            <div className="taskItems">
              {tasks.map((task) => (
                <TaskItem task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
