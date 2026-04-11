import { Tag as ArcoTag } from "@arco-design/web-react";
import { formatData, formatTaskPriority } from "@/utils/common";
import styles from "./index.module.less";

interface TagProps {
  taskMembers?: string[];
  taskDeadline?: string;
  taskPriority?: string;
  taskWorkTime?: string;
}

export default function Tag({
  taskMembers,
  taskDeadline,
  taskPriority,
  taskWorkTime,
}: TagProps) {
  const tagList = [
    {
      title: "负责人",
      data: taskMembers?.[0] || "-",
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
    <div className={styles.tag}>
      {tagList &&
        tagList.map((item, index) => (
          <ArcoTag
            key={index + item.title}
            className={styles.tag__item}
            title={`${item.title}：${item.data}`}
            bordered
          >
            <span className={styles.tag__label}>{item.title}：</span>
            <span className={styles.tag__value}>{item.data}</span>
          </ArcoTag>
        ))}
    </div>
  );
}
