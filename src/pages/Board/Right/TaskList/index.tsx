import styles from "./index.module.less";
import { Checkbox } from "@arco-design/web-react";

interface TaskListProps {
  subtasks?: string[];
}

export default function TaskList({ subtasks = [] }: TaskListProps) {
  return (
    <div className={styles.taskList}>
      <div className={styles.title}>子任务清单</div>
      <div className={styles.data}>
        {subtasks.length > 0 ? (
          subtasks.map((item, index) => (
            <div key={`${item}-${index}`} className={styles.taskItem}>
              <Checkbox checked={false} />
              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className={styles.taskItem}>暂无子任务</div>
        )}
      </div>
    </div>
  );
}
