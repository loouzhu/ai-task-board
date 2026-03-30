import TagItem from "@/components/TagItem";
import { formatData, formatTaskPriority } from "@/utils/common";
import "./index.less";

interface TagProps {
  members?: string[];
  taskDeadline?: string;
  taskPriority?: string;
  taskWorkTime?: string;
}

export default function Tag({
  members,
  taskDeadline,
  taskPriority,
  taskWorkTime,
}: TagProps) {
  const tagList = [
    {
      title: "负责人",
      data: members?.[0] || "-",
    },
    {
      title: "截止日期",
      data: taskDeadline ? formatData(taskDeadline) : "-",
    },
    {
      title: "优先级",
      data: taskPriority ? formatTaskPriority(taskPriority) : "-",
    },
    {
      title: "预估工时",
      data: taskWorkTime ? taskWorkTime : "-",
    },
  ];
  return (
    <div className="tag">
      {tagList &&
        tagList.map((item, index) => (
          <TagItem
            title={item.title}
            data={item.data}
            key={index + item.title}
          />
        ))}
    </div>
  );
}
