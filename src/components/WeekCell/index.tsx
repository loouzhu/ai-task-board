import styles from "./index.module.less";
import { Message } from "@arco-design/web-react";
import type { MonthWeekCellData } from "@/types/dataView";
import { formatData } from "@/utils/common";
import { useIsDarkTheme } from "@/hooks/useIsDarkTheme";

interface WeekCellProps {
  weekData: MonthWeekCellData;
  weekIndex: number;
  memberName: string;
}

export default function WeekCell({
  weekData,
  weekIndex,
  memberName,
}: WeekCellProps) {
  const total = weekData?.completed_task ?? 0;
  const isDark = useIsDarkTheme();
  const dateRangeText =
    weekData?.startDate && weekData?.endDate
      ? `${formatData(weekData.startDate)} - ${formatData(weekData.endDate)}`
      : `第${weekIndex}周`;

  const getColorByCount = (count: number) => {
    if (isDark) {
      if (count <= 5) return "#31343a";
      if (count <= 25) return "#1f4f3a";
      if (count <= 55) return "#2e7d53";
      if (count <= 75) return "#3ea96a";
      return "#4fcf83";
    }
    if (count <= 5) return "#ebedf0";
    if (count <= 25) return "#9be9a8";
    if (count <= 55) return "#40c463";
    if (count <= 75) return "#30a14e";
    return "#216e39";
  };

  return (
    <div
      className={styles.weekCell}
      style={{
        backgroundColor: getColorByCount(total),
      }}
      title={`${memberName} ${dateRangeText} 完成 ${total} 个任务`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onClick={() => {
        Message.info(`${memberName} ${dateRangeText} 完成了 ${total} 个任务`);
      }}
    >
      <span
        className={styles.weekCellTotal}
        style={{
          color: total > 55 ? "var(--app-surface)" : "var(--app-text)",
        }}
      >
        {total}
      </span>
      <span
        className={styles.weekCellLabel}
        style={{
          color: total > 10 ? "rgba(255,255,255,0.8)" : "var(--app-subtext)",
        }}
      >
        任务量
      </span>
    </div>
  );
}
