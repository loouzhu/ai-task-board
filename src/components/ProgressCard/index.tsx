import styles from "./index.module.less";
import { Progress } from "@arco-design/web-react";

interface ProgressCardProps {
  title?: string;
  percent: number;
}

export default function ProgressCard({ title, percent }: ProgressCardProps) {
  return (
    <div className={styles.progressCard}>
      <div className={styles.title}>{title}</div>
      <div className={styles.progress}>
        <Progress percent={percent} size="large" />
      </div>
    </div>
  );
}
