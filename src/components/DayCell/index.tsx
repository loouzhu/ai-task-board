import styles from "./index.module.less";
import type { DayCellData } from "@/types/dataView";

interface DateCellProps {
  dayData: DayCellData;
}

export default function DateCell({ dayData }: DateCellProps) {
  const completedCount = dayData.task || 0;
  const isBlocked = dayData.blocked;
  const isOverdue = dayData.overdue;

  const getColorByCount = (count: number) => {
    if (count <= 5) return "#ebedf0";
    if (count <= 10) return "#9be9a8";
    if (count <= 15) return "#40c463";
    return "#30a14e";
  };

  return (
    <div
      className={styles.dateCell}
      style={{
        color: completedCount > 4 ? "#fff" : "#1f1f1f",
        backgroundColor: getColorByCount(completedCount),
      }}
      title={`完成 ${completedCount} 个任务${isBlocked ? "，有阻塞任务" : ""}${isOverdue ? "，有逾期任务" : ""}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {completedCount}
      {/* 阻塞标记：蓝点 */}
      {isBlocked && <span className={styles.blocked} />}
      {/* 逾期标记：红三角 */}
      {isOverdue && <span className={styles.overDue} />}
    </div>
  );
}
