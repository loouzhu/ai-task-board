import styles from "./index.module.less";
import type { DayCellData } from "@/types/dataView";
import { useIsDarkTheme } from "@/hooks/useIsDarkTheme";

interface DateCellProps {
  dayData: DayCellData;
}

export default function DateCell({ dayData }: DateCellProps) {
  const completedCount = dayData.completed_task || 0;
  const isBlocked = dayData.blocked;
  const isOverdue = dayData.overdue;
  const isDark = useIsDarkTheme();

  const getColorByCount = (count: number) => {
    if (isDark) {
      if (count <= 5) return "#31343a";
      if (count <= 10) return "#1f4f3a";
      if (count <= 15) return "#2e7d53";
      return "#3ea96a";
    }
    if (count <= 5) return "#ebedf0";
    if (count <= 10) return "#9be9a8";
    if (count <= 15) return "#40c463";
    return "#30a14e";
  };

  return (
    <div
      className={styles.dateCell}
      style={{
        color: completedCount > 4 ? "#fff" : "var(--app-text)",
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
