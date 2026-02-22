import React from "react";
import "./index.less";

export default function Describe() {
  return (
    <div className="describe">
      <div className="part">
        <div className="title">任务描述</div>
        <textarea className="detail">
          任务描述任务描述任务描述任务描述任务描述任务描述任务描述 任务描述
          任务描述 任务描述 任务描述 任务描述 任务描述 任务描述 任务描述
        </textarea>
      </div>
      <div className="part">
        <div className="title">参与研发</div>
        <div className="participants">李四、王五、赵六</div>
      </div>
    </div>
  );
}
