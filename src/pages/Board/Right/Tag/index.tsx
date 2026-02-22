import React from "react";
import TagItem from "@/components/TagItem";
import "./index.less";

export default function Tag() {
  const tagList = [
    {
      title: "负责人",
      data: "张三",
    },
    {
      title: "截止日期",
      data: "2026-09-09",
    },
    {
      title: "优先级",
      data: "高",
    },
    {
      title: "预估工时",
      data: "2h",
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
