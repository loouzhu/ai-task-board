import "./index.less";
import { Message } from "@arco-design/web-react";

interface WeekCellProps {
  total: number;
  weekIndex: number;
  memberName: string;
}

export default function WeekCell({
  total,
  weekIndex,
  memberName,
}: WeekCellProps) {
  const getColorByCount = (count: number) => {
    if (count === 0) return "#ebedf0";
    if (count <= 5) return "#9be9a8";
    if (count <= 10) return "#40c463";
    if (count <= 15) return "#30a14e";
    return "#216e39";
  };

  return (
    <div
      className="weekCell"
      style={{
        backgroundColor: getColorByCount(total),
      }}
      title={`${memberName} 第${weekIndex}周完成 ${total} 个任务`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onClick={() => {
        Message.info(`${memberName} 第${weekIndex}周完成了 ${total} 个任务`);
      }}
    >
      <span
        className="weekCellTotal"
        style={{
          color: total > 10 ? "#fff" : "#1f1f1f",
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
        个任务
      </span>
    </div>
  );
}
