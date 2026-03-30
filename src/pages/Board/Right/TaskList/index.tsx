import "./index.less";
import { Checkbox } from "@arco-design/web-react";

interface TaskListProps {
  subtasks?: string[];
}

export default function TaskList({ subtasks = [] }: TaskListProps) {
  return (
    <div className="taskList">
      <div className="title">子任务清单</div>
      <div className="data">
        {subtasks.length > 0 ? (
          subtasks.map((item, index) => (
            <div key={`${item}-${index}`} className="taskItem">
              <Checkbox checked={false} />
              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className="taskItem">暂无子任务</div>
        )}
      </div>
    </div>
  );
}
