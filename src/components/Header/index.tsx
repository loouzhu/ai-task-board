import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  IconExport,
  IconHome,
  IconMoreVertical,
  IconPlus,
  IconEdit,
  IconDelete,
  IconSun,
  IconMoon,
} from "@arco-design/web-react/icon";
import {
  Layout,
  Avatar,
  Menu,
  Message,
  Select,
  Dropdown,
  Popconfirm,
  Switch,
} from "@arco-design/web-react";
import { useTheme } from "@/hooks/useTheme";
import { pageList } from "@/types/common";
import styles from "./index.module.less";
import UserMenuItem from "../UserMenuItem";
import TeamOptionModal from "../TeamOptionModal";
import { useLogout, useMeQuery } from "@/hooks/useAuth";
import { useGetTeamList, useGetTeamInfo, useDeleteTeam } from "@/hooks/useTeam";
import { useGetUserInfoById } from "@/hooks/useUser";
import type { team } from "@/types/team";

export default function Header() {
  const Header = Layout.Header;
  const MenuItem = Menu.Item;
  const Option = Select.Option;
  const logoutMutation = useLogout();
  const { isDark, toggleTheme } = useTheme();
  const meQuery = useMeQuery();
  const user = meQuery.data?.user;
  const location = useLocation();
  const { teamId } = useParams();
  const currentPage = pageList.find((item) => {
    if (!item.path) return false;
    return location.pathname.includes(item.path);
  })?.path;
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] =
    useState<boolean>(false);
  const [createTeamModalVisible, setCreateTeamModalVisible] =
    useState<boolean>(false);
  const [editTeamModalVisible, setEditTeamModalVisible] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const teamList = useGetTeamList()?.data?.teams || [];
  const currentTeamId = teamId || teamList[0]?.teamId || "";
  const currentTeamInfo = useGetTeamInfo(currentTeamId)?.data?.team;
  const deleteTeamMutation = useDeleteTeam();
  const currentUserId = user?.userId || "";
  const userInfoQuery = useGetUserInfoById(currentUserId);
  const { username, avatar } = userInfoQuery.data?.userInfo || {};

  const handleChangePage = (index: number) => {
    const targetPath = pageList[index].path;
    if (!targetPath) {
      return;
    }
    if (!currentTeamId) {
      Message.info("请先选择团队");
      return;
    }
    navigate(`/team/${currentTeamId}${targetPath}`, { replace: true });
  };

  const handleChangeTeam = (value: string) => {
    const restPath = location.pathname.replace(/^\/team\/[^/]+/, "");
    const targetPath = `/team/${value}${restPath}`;
    navigate(
      {
        pathname: targetPath,
        search: location.search,
        hash: location.hash,
      },
      { replace: true },
    );
  };

  const goPersonalHomepage = () => {
    navigate(`/user/${user?.userId}`);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setLogoutConfirmVisible(false);
    setUserMenu(false);
  };

  const handleLogoutConfirmVisibleChange = (visible: boolean) => {
    setLogoutConfirmVisible(visible);
    if (!visible) {
      setUserMenu(false);
    }
  };

  const handleDeleteTeam = () => {
    if (!currentTeamId) {
      Message.info("请先选择团队");
      return;
    }
    if (deleteTeamMutation.isPending) {
      return;
    }
    deleteTeamMutation.mutate(currentTeamId, {
      onSuccess: () => {
        navigate("/team");
      },
    });
  };

  const dropList = (
    <Menu>
      <MenuItem
        key="createTeam"
        onClick={() => setCreateTeamModalVisible(true)}
      >
        <IconPlus /> 创建团队
      </MenuItem>
      <MenuItem key="editTeam" onClick={() => setEditTeamModalVisible(true)}>
        <IconEdit /> 编辑团队
      </MenuItem>
      <MenuItem key="deleteTeam">
        <Popconfirm
          title="确定要解散该团队吗？"
          okText="确定"
          cancelText="取消"
          onOk={handleDeleteTeam}
          trigger="click"
        >
          <span
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <IconDelete /> 解散团队
          </span>
        </Popconfirm>
      </MenuItem>
    </Menu>
  );

  return (
    <Header className={styles.headerContent}>
      {/* 当前团队 */}
      <div className={styles.team}>
        <div className={styles.teamTitle}>当前团队：</div>
        <Select
          value={currentTeamId || undefined}
          style={{ width: "120px", marginRight: "10px" }}
          placeholder="暂无团队"
          onChange={handleChangeTeam}
        >
          {teamList.map((team: team) => (
            <Option key={team.teamId} value={team.teamId}>
              {team.teamName}
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
      {/* 页面列表 */}
      <div className={styles.list}>
        {pageList.map((item, index) => (
          <span
            key={item.name + index}
            className={`${styles.listItem} ${item.path && item.path === currentPage ? styles.active : ""}`}
            onClick={() => handleChangePage(index)}
          >
            {item.name}
          </span>
        ))}
      </div>
      {/* 主题切换 */}
      <div className="changeTheme">
        <Switch
          checked={isDark}
          checkedIcon={<IconMoon style={{ color: "#262626" }} />}
          uncheckedIcon={<IconSun style={{ color: "#4e5969" }} />}
          style={{ backgroundColor: isDark ? "#5f5f5f69" : "#d9dde5" }}
          onChange={toggleTheme}
        />
      </div>
      {/* 用户信息 */}
      <div
        className={styles.userInfo}
        onMouseEnter={() => setUserMenu(true)}
        onMouseLeave={() => {
          if (logoutConfirmVisible) {
            return;
          }
          setUserMenu(false);
        }}
      >
        <Avatar size={35}>
          <img src={avatar || ""} alt="" />
        </Avatar>
        <span className={styles.username} title={username || "用户名"}>
          {username || "用户名"}
        </span>
        {userMenu && (
          <Menu className={styles.userMenu} selectable={false}>
            <UserMenuItem
              menuItemKey="1"
              icon={<IconHome />}
              content="前往个人主页"
              onClickFn={goPersonalHomepage}
            />
            <Popconfirm
              title="确定要退出登录吗？"
              okText="确定"
              cancelText="取消"
              onOk={handleLogout}
              onVisibleChange={handleLogoutConfirmVisibleChange}
              trigger="click"
            >
              <UserMenuItem
                menuItemKey="2"
                icon={<IconExport />}
                content="退出登录"
              />
            </Popconfirm>
          </Menu>
        )}
      </div>
      {/* 创建团队 */}
      <TeamOptionModal
        type="create"
        teams={teamList}
        visible={createTeamModalVisible}
        onVisibleChange={setCreateTeamModalVisible}
      />
      {/* 编辑团队 */}
      <TeamOptionModal
        type="edit"
        teams={teamList}
        teamInfo={currentTeamInfo}
        visible={editTeamModalVisible}
        onVisibleChange={setEditTeamModalVisible}
      />
    </Header>
  );
}
