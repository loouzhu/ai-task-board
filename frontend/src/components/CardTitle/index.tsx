import styles from "./index.module.less";

interface CardTitleProps {
  title: string;
  className?: string;
}

export default function CardTitle({ title, className }: CardTitleProps) {
  return (
    <div className={[styles.cardTitle, className].filter(Boolean).join(" ")}>
      {title}
    </div>
  );
}
