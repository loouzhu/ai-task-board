import type { task, taskType } from "@/types/task";
import { useState } from "react";
import { Empty } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import TaskOptionModal from "../TaskOptionModal";
import TaskItem from "../TaskItem";
import { useBoardStore } from "@/stores/boardStore";
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
  const [addModalVisible, setAddModalVisible] = useState(false);
  const boardMembers = useBoardStore((state) => state.boardMembers);
  const handleAddTask = () => {
    setAddModalVisible(true);
  };

  return (
    <div className={`taskColumns ${className}`} key={columnStatus}>
      {/* 列头 */}
      <div className="status">
        <div className="left">
          <div className="type">{columnLabel ?? columnStatus}</div>
          <IconPlus onClick={handleAddTask} />
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

      <TaskOptionModal
        type="add"
        visible={addModalVisible}
        addStatus={columnStatus}
        boardMembers={boardMembers}
        onVisibleChange={setAddModalVisible}
      />
    </div>
  );
}
