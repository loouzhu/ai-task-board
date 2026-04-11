import styles from "./index.module.less";

interface CardHeadProps {
  icon?: React.ReactNode;
  title: string;
  to?: string;
  toIcon?: React.ReactNode;
}

export default function CardHead({ icon, title, to, toIcon }: CardHeadProps) {
  return (
    <div className={styles.cardHead}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.title}>{title}</div>
      {to && <a href={to}>{toIcon}</a>}
    </div>
  );
}
