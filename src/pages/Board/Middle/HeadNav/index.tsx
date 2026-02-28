import React from "react";
import {
  IconHome,
  IconUser,
  IconNotification,
  IconMoreVertical,
} from "@arco-design/web-react/icon";
import "./index.less";

export default function HeaderNav() {
  return (
    <div className="headerNav">
      <span className="part">
        <IconHome />
        <span className="title">看板名称：</span>
        <span className="data">敏捷开发冲刺 Sprint 23</span>
      </span>
      <span className="part">
        <IconUser />
        <span className="title">参与研发：</span>
        <span className="data">张三，李四，王五</span>
      </span>
      <span className="icon">
        <IconNotification />
        <IconMoreVertical />
      </span>
    </div>
  );
}
