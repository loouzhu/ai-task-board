import styles from "./index.module.less";

interface focusItemProps {
  item: {
    name: string;
    belong: string;
    tag: string;
    deadline: string;
  };
}

export default function FocusItem({ item }: focusItemProps) {
  const tagClassName =
    item.tag === "高优先"
      ? styles.focusItem__tagHigh
      : item.tag === "已逾期"
        ? styles.focusItem__tagOverdue
        : "";

  return (
    <article key={item.name} className={styles.focusItem}>
      <div className={styles.focusItem__main}>
        <strong>{item.name}</strong>
        <p>{item.belong}</p>
      </div>
      <div className={styles.focusItem__meta}>
        {item.tag ? (
          <span className={`${styles.focusItem__tag} ${tagClassName}`}>
            {item.tag}
          </span>
        ) : null}
        <span className={styles.focusItem__deadline}>{item.deadline}</span>
      </div>
    </article>
  );
}
