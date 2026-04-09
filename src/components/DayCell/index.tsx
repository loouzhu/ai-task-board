import "./index.less";
import type { DayCellRecord, DayIndex } from "@/types/dataView";

interface DateCellProps {
  value: number;
  record: DayCellRecord;
  dayIndex: DayIndex;
}

export default function DateCell({ value, record, dayIndex }: DateCellProps) {
  const completedCount = value || 0;
  const isBlocked = record[`day${dayIndex}_blocked`];
  const isOverdue = record[`day${dayIndex}_overdue`];

  const getColorByCount = (count: number) => {
    if (count === 0) return "#ebedf0";
    if (count <= 2) return "#9be9a8";
    if (count <= 4) return "#40c463";
    return "#30a14e";
  };

  return (
    <div
      className="dateCell"
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
      {isBlocked && <span className="blocked" />}
      {/* 逾期标记：红三角 */}
      {isOverdue && <span className="overDue" />}
    </div>
  );
}
