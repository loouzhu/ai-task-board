import "./index.less";
import { Message } from "@arco-design/web-react";
import type { MonthWeekCellData } from "@/types/dataView";
import { formatData } from "@/utils/common";

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
  const total = weekData?.task ?? 0;
  const dateRangeText =
    weekData?.startDate && weekData?.endDate
      ? `${formatData(weekData.startDate)} - ${formatData(weekData.endDate)}`
      : `第${weekIndex}周`;

  const getColorByCount = (count: number) => {
    if (count <= 5) return "#ebedf0";
    if (count <= 25) return "#9be9a8";
    if (count <= 55) return "#40c463";
    if (count <= 75) return "#30a14e";
    return "#216e39";
  };

  return (
    <div
      className="weekCell"
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
        className="weekCellTotal"
        style={{
          color: total > 55 ? "#fff" : "#1f1f1f",
        }}
      >
        {total}
      </span>
      <span
        className="weekCellLabel"
        style={{
          color: total > 10 ? "rgba(255,255,255,0.8)" : "#86909c",
        }}
      >
        任务量
      </span>
    </div>
  );
}
