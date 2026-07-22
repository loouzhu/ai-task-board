import styles from "./index.module.less";
import { Button } from "@arco-design/web-react";

interface CardHeadProps {
  icon?: React.ReactNode;
  title: string;
  to?: string;
  toIcon?: React.ReactNode;
  AIOptionName?: string;
  AIOptionFn?: () => void;
}

export default function CardHead({
  icon,
  title,
  to,
  toIcon,
  AIOptionName,
  AIOptionFn,
}: CardHeadProps) {
  return (
    <div className={styles.cardHead}>
      <div className={styles.content}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.title}>{title}</div>
        {AIOptionName && AIOptionFn && (
          <div className={styles.summary}>
            <Button type="secondary" onClick={AIOptionFn} size="mini">
              {AIOptionName}
            </Button>
          </div>
        )}
      </div>
      {to && <a href={to}>{toIcon}</a>}
    </div>
  );
}
