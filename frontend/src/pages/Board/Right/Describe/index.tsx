import styles from "./index.module.less";

interface DescribeProps {
  taskDescription?: string;
  participantNames?: string[];
}

export default function Describe({
  taskDescription,
  participantNames,
}: DescribeProps) {
  return (
    <div className={styles.describe}>
      <div className={styles.part}>
        <div className={styles.title}>任务描述</div>
        <textarea className={styles.detail} value={taskDescription || ""} readOnly />
      </div>
      <div className={styles.part}>
        <div className={styles.title}>参与研发</div>
        <div className={styles.participants}>
          {participantNames?.join("、") || "-"}
        </div>
      </div>
    </div>
  );
}
