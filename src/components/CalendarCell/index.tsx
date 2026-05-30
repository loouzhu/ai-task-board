import styles from "./index.module.less";

type CalendarCellProps = {
  date: string;
  count: number;
  description?: string;
};

export default function CalendarCell({
  date,
  count,
  description = "任务量",
}: CalendarCellProps) {
  return (
    <div className={styles.dayCell}>
      <div className={styles.dayLabel}>{date}</div>
      <div className={styles.dayCount}>{count}</div>
      <div className={styles.dayDescription}>{description}</div>
    </div>
  );
}
