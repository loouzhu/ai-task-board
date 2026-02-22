import React from "react";
import { Layout } from "@arco-design/web-react";
import {
  IconHome,
  IconUser,
  IconNotification,
  IconMoreVertical,
} from "@arco-design/web-react/icon";
import "./index.less";

export default function Middle() {
  const Content = Layout.Content;
  return (
    <Content className="middle">
      <div className="header">
        <span className="name">
          <IconHome />
          看板名称：敏捷开发冲刺 Sprint 23
        </span>
        <span className="participants">
          <IconUser />
          参与研发：张三，李四，王五
        </span>
        <span>
          <IconNotification />
        </span>
        <span>
          <IconMoreVertical />
        </span>
      </div>
      <div className="filter">筛选栏</div>
    </Content>
  );
}
