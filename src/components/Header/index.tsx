import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconUser,
  IconExport,
  IconMoreVertical,
  IconPlus,
  IconEdit,
  IconDelete,
} from "@arco-design/web-react/icon";
import {
  Layout,
  Avatar,
  Menu,
  Message,
  Select,
  Dropdown,
} from "@arco-design/web-react";
import { pageList } from "@/types/common";
import styles from "./index.module.less";
import { useLogout, useMeQuery } from "@/hooks/useAuth";

export default function Header() {
  const Header = Layout.Header;
  const MenuItem = Menu.Item;
  const Option = Select.Option;
  const logoutMutation = useLogout();
  const user = useMeQuery().data?.user;
  const location = useLocation();
  const currentPage = location.pathname;
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChangePage = (index: number) => {
    const targetPath = pageList[index].path;
    if (!targetPath) {
      Message.info("该功能正在开发中");
      return;
    }
    navigate(targetPath, { replace: true });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const teamList = ["团队A", "团队B", "团队C"];

  const dropList = (
    <Menu>
      <MenuItem key="createTeam">
        <IconPlus /> 创建团队
      </MenuItem>
      <MenuItem key="editTeam">
        <IconEdit /> 编辑团队
      </MenuItem>
      <MenuItem key="deleteTeam">
        <IconDelete /> 解散团队
      </MenuItem>
    </Menu>
  );

  return (
    <Header className={styles.headerContent}>
      {/* 当前团队 */}
      <div className={styles.team}>
        <div className={styles.teamTitle}>当前团队：</div>
        <Select
          style={{ width: "120px", marginRight: "10px" }}
          placeholder="暂无团队"
        >
          {teamList.map((team) => (
            <Option key={team} value={team}>
              {team}
            </Option>
          ))}
        </Select>
        {/* 团队操作 */}
        <div className={styles.boardOptions}>
          <Dropdown droplist={dropList}>
            <IconMoreVertical />
          </Dropdown>
        </div>
      </div>
      <div className={styles.title}>AI智能任务看板</div>
      <div className={styles.list}>
        {pageList.map((item, index) => (
          <span
            key={item.name + index}
            className={`${styles.listItem} ${item.path === currentPage ? styles.active : ""}`}
            onClick={() => handleChangePage(index)}
          >
            {item.name}
          </span>
        ))}
      </div>
      <div
        className={styles.userInfo}
        onMouseEnter={() => setUserMenu(true)}
        onMouseLeave={() => setUserMenu(false)}
      >
        <Avatar size={35}>
          <IconUser />
        </Avatar>
        <span className={styles.username} title={user?.username}>
          {user?.username}
        </span>
        {userMenu && (
          <Menu className={styles.userMenu}>
            <MenuItem
              key="0"
              className={styles.userMenuItem}
              onClick={handleLogout}
            >
              <div className={styles.icon}>{<IconExport />}</div>
              <div className={styles.content}>退出登录</div>
            </MenuItem>
          </Menu>
        )}
      </div>
    </Header>
  );
}
