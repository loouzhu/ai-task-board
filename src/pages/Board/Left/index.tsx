import { Layout, Menu } from "@arco-design/web-react";
import {
  IconCalendar,
  IconPlus,
  IconPen,
  IconDelete,
} from "@arco-design/web-react/icon";
import "./index.less";

export default function LeftSide() {
  const Sider = Layout.Sider;
  const MenuItem = Menu.Item;
  const SubMenu = Menu.SubMenu;
  return (
    <Sider className="leftSide">
      <Menu
        defaultOpenKeys={["1"]}
        defaultSelectedKeys={["0_1"]}
        collapse={false}
      >
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
            删除当前看板
          </MenuItem>
        </SubMenu>
        {/* 列管理 */}
        {/* <SubMenu
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
        </SubMenu> */}
      </Menu>
    </Sider>
  );
}
