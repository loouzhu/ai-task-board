import "./index.less";

interface Task {
  name: string;
  priority: string;
  deadline: string;
  info?: string;
}

interface TaskProp {
  task: Task;
}

export default function TaskItem({ task }: TaskProp) {
  return (
    <div className="taskItem">
      <div className="name">任务名：{task.name}</div>
      <div className="priority">
        优先级：
        {task.priority === "high"
          ? "高"
          : task.priority === "medium"
            ? "中"
            : "低"}
      </div>
      <div className="assignee">负责人：张三</div>
      <div className="deadline">截止日期：{task.deadline}</div>
      {task.info && <div className="else">{task.info}</div>}
    </div>
  );
}
