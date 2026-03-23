import { useState } from "react";
import { IconUser, IconExport } from "@arco-design/web-react/icon";
import { Layout, Avatar, Menu } from "@arco-design/web-react";
import { pageList } from "@/types/common";
import "./index.less";
import { useLogout, useMeQuery } from "@/hooks/useAuth";

export default function Header() {
  const Header = Layout.Header;
  const MenuItem = Menu.Item;
  const logoutMutation = useLogout();
  const user = useMeQuery().data?.user;
  const [activeIndex, setActiveIndex] = useState(0);
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const handleChangePage = (index: number) => {
    setActiveIndex(index);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Header className="headerContent">
      <div className="title">AI智能任务看板</div>
      <div className="list">
        {pageList.map((item, index) => (
          <span
            key={item.name + index}
            className={`listItem ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleChangePage(index)}
          >
            {item.name}
          </span>
        ))}
      </div>
      <div
        className="userInfo"
        onMouseEnter={() => setUserMenu(true)}
        onMouseLeave={() => setUserMenu(false)}
      >
        <Avatar size={35}>
          <IconUser />
        </Avatar>
        <span className="username" title={user?.username}>
          {user?.username}
        </span>
        {userMenu && (
          <Menu className="userMenu">
            <MenuItem key="0" className="userMenuItem" onClick={handleLogout}>
              <div className="icon">{<IconExport />}</div>
              <div className="content">退出登录</div>
            </MenuItem>
          </Menu>
        )}
      </div>
    </Header>
  );
}
