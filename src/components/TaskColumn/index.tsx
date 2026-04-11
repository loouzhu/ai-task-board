import type { task, taskType } from "@/types/task";
import { useState } from "react";
import { Empty } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import TaskOptionModal from "../TaskOptionModal";
import TaskItem from "../TaskItem";
import { useBoardStore } from "@/stores/boardStore";
import styles from "./index.module.less";

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
    <div className={`${styles.taskColumns} ${className}`} key={columnStatus}>
      {/* 列头 */}
      <div className={styles.status}>
        <div className={styles.left}>
          <div className={styles.type}>{columnLabel ?? columnStatus}</div>
          <IconPlus onClick={handleAddTask} style={{ cursor: "pointer" }} />
        </div>
        <div className={styles.count}>{count}个任务</div>
      </div>

      {/* 任务列表 */}
      {tasks.length > 0 ? (
        <div className={styles.taskItems}>
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
