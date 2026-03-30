import { status } from "@/constants/common";
import type { taskType } from "@/types/task";
import "./index.less";

interface HeadProps {
  taskNumber?: number;
  taskName?: string;
  taskStatus?: taskType;
}

export default function Head({ taskNumber, taskName, taskStatus }: HeadProps) {
  return (
    <div className="head">
      <span className="number">#{taskNumber ?? "-"}</span>
      <span className="name">{taskName || "请选择任务"}</span>
      <span className="status">{taskStatus ? status[taskStatus] : "-"}</span>
    </div>
  );
}
