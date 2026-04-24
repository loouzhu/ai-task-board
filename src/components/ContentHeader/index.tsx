import styles from "./index.module.less";

interface contentHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function ContentHeader({
  title,
  description,
  className,
}: contentHeaderProps) {
  return (
    <header
      className={[styles.contentHeader, className].filter(Boolean).join(" ")}
    >
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}
