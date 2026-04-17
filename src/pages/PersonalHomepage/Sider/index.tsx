import styles from "./index.module.less";
import { useState } from "react";
import { Layout, Menu } from "@arco-design/web-react";
import {
  IconUser,
  IconHome,
  IconMenuFold,
  IconMenuUnfold,
} from "@arco-design/web-react/icon";
import type { PersonalMenuKey } from "..";

interface SiderProps {
  activeMenu: PersonalMenuKey;
  onChange: (key: PersonalMenuKey) => void;
}

export default function Sider({ activeMenu, onChange }: SiderProps) {
  const Sider = Layout.Sider;
  const MenuItem = Menu.Item;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      width={228}
      collapsedWidth={64}
      collapsed={collapsed}
      collapsible
      trigger={collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
      onCollapse={setCollapsed}
      breakpoint="xl"
      className={`${styles.sider} ${collapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.logo}>
        {collapsed ? (
          <div className={styles.logoIcon}>AI</div>
        ) : (
          <>
            <div className={styles.logoIcon}>AI</div>
            <div className={styles.logoText}>个人主页</div>
          </>
        )}
      </div>
      <Menu
        selectedKeys={[activeMenu]}
        style={{ width: "100%" }}
        onClickMenuItem={(key) => onChange(key as PersonalMenuKey)}
      >
        <MenuItem key="workbench">
          <span className={styles.menuIcon}>
            <IconHome />
          </span>
          {!collapsed && <span className={styles.menuText}>我的工作台</span>}
        </MenuItem>
        <MenuItem key="profile">
          <span className={styles.menuIcon}>
            <IconUser />
          </span>
          {!collapsed && <span className={styles.menuText}>我的信息</span>}
        </MenuItem>
      </Menu>
    </Sider>
  );
}
