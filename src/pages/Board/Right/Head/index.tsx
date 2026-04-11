import { status } from "@/constants/common";
import type { taskType } from "@/types/task";
import styles from "./index.module.less";

interface HeadProps {
  taskNumber?: number;
  taskName?: string;
  taskStatus?: taskType;
}

export default function Head({ taskNumber, taskName, taskStatus }: HeadProps) {
  return (
    <div className={styles.head}>
      <span className={styles.number}>#{taskNumber ?? "-"}</span>
      <span className={styles.name}>{taskName || "请选择任务"}</span>
      <span className={styles.status}>{taskStatus ? status[taskStatus] : "-"}</span>
    </div>
  );
}
