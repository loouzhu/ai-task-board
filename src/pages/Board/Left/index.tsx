import React from "react";
import { Layout,Menu } from "@arco-design/web-react";
import {
  IconCalendar,
  IconPlus,
  IconPen,
  IconDelete,
} from "@arco-design/web-react/icon";

export default function LeftSide() {
  const Sider = Layout.Sider;
  const MenuItem = Menu.Item;
  const SubMenu = Menu.SubMenu;
  return (
    <Sider
      className="options"
      style={{
        width: 230,
      }}
    >
      <Menu defaultOpenKeys={["1"]} defaultSelectedKeys={["0_1"]}>
        {/* 看板管理 */}
        <SubMenu
          key="0_1"
          title={
            <span>
              <IconCalendar />
              看板管理
            </span>
          }
        >
          <MenuItem key="0_1_1">
            <IconPlus />
            创建看板
          </MenuItem>
          <MenuItem key="0_1_2">
            <IconPen />
            编辑看板名称
          </MenuItem>
          <MenuItem key="0_1_3">
            <IconDelete />
            删除看板
          </MenuItem>
        </SubMenu>
        {/* 列管理 */}
        <SubMenu
          key="0_2"
          title={
            <span>
              <IconCalendar />
              列管理
            </span>
          }
        >
          <MenuItem key="0_2_1">
            <IconPlus />
            添加列
          </MenuItem>
          <MenuItem key="0_2_2">
            <IconPen />
            重命名列
          </MenuItem>
          <MenuItem key="0_2_3">
            <IconDelete />
            删除列
          </MenuItem>
          <MenuItem key="0_2_4">
            <IconDelete />
            调整列顺序
          </MenuItem>
        </SubMenu>
        {/* 任务管理 */}
        <SubMenu
          key="0_3"
          title={
            <span>
              <IconCalendar />
              任务管理
            </span>
          }
        >
          <MenuItem key="0_3_1">
            <IconPlus />
            创建任务
          </MenuItem>
          <MenuItem key="0_3_2">
            <IconPen />
            编辑任务
          </MenuItem>
          <MenuItem key="0_3_3">
            <IconDelete />
            删除任务
          </MenuItem>
          <MenuItem key="0_3_4">
            <IconDelete />
            复制任务
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sider>
  );
}
