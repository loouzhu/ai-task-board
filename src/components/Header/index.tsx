import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
  Popconfirm,
} from "@arco-design/web-react";
import { pageList } from "@/types/common";
import styles from "./index.module.less";
import TeamOptionModal from "../TeamOptionModal";
import { useLogout, useMeQuery } from "@/hooks/useAuth";
import { useGetTeamList, useGetTeamInfo, useDeleteTeam } from "@/hooks/useTeam";
import type { team } from "@/types/team";

export default function Header() {
  const Header = Layout.Header;
  const MenuItem = Menu.Item;
  const Option = Select.Option;
  const logoutMutation = useLogout();
  const user = useMeQuery().data?.user;
  const location = useLocation();
  const { teamId } = useParams();
  const currentPage = pageList.find((item) => {
    if (!item.path) return false;
    return location.pathname.includes(item.path);
  })?.path;
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [createTeamModalVisible, setCreateTeamModalVisible] =
    useState<boolean>(false);
  const [editTeamModalVisible, setEditTeamModalVisible] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const teamList = useGetTeamList()?.data?.teams || [];
  const currentTeamId = teamId || teamList[0]?.teamId || "";
  const currentTeamInfo = useGetTeamInfo(currentTeamId)?.data?.team;
  const deleteTeamMutation = useDeleteTeam();

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDeleteTeam = () => {
    if (!currentTeamId) {
      Message.info("请先选择团队");
      return;
    }
    deleteTeamMutation.mutate(currentTeamId);
    navigate("/team");
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
