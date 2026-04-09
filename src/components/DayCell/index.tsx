import "./index.less";
import type { DayCellData } from "@/types/dataView";

interface DateCellProps {
  dayData: DayCellData;
}

export default function DateCell({ dayData }: DateCellProps) {
  const completedCount = dayData.task || 0;
  const isBlocked = dayData.blocked;
  const isDelay = dayData.delay;

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
      title={`完成 ${completedCount} 个任务${isBlocked ? "，有阻塞任务" : ""}${isDelay ? "，有延期任务" : ""}`}
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
      {/* 延期标记：红三角 */}
      {isDelay && <span className="overDue" />}
    </div>
  );
}
