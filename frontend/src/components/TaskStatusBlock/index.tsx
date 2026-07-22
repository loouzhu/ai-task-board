import styles from "./index.module.less";

interface TaskStatusBlock {
  title: string;
  data: number;
  description?: string;
}

export default function TaskStatusBlock({
  title,
  data,
  description,
}: TaskStatusBlock) {
  return (
    <div className={styles.taskStatusBlock}>
      <div className={styles.title}>{title}</div>
      <div className={styles.data}>{data}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}
