import { Menu } from "@arco-design/web-react";
import styles from "./index.module.less";

interface userMenuItemProps {
  menuItemKey?: string;
  icon?: React.ReactNode;
  content: string;
  className?: string;
  onClickFn?: () => void;
  onClick?: () => void;
}

export default function UserMenuItem({
  menuItemKey,
  icon,
  content,
  className,
  onClickFn,
  onClick,
}: userMenuItemProps) {
  const MenuItem = Menu.Item;
  return (
    <MenuItem
      key={menuItemKey || content}
      className={[styles.userMenuItem, className].filter(Boolean).join(" ")}
      onClick={() => {
        onClick?.();
        onClickFn?.();
      }}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>{content}</div>
    </MenuItem>
  );
}
