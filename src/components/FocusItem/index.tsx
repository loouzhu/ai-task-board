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
  return (
    <article key={item.name} className={styles.focusItem}>
      <div className={styles.focusItem__main}>
        <strong>{item.name}</strong>
        <p>{item.belong}</p>
      </div>
      <div className={styles.focusItem__meta}>
        <span className={styles.focusItem__tag}>{item.tag}</span>
        <span className={styles.focusItem__deadline}>{item.deadline}</span>
      </div>
    </article>
  );
}
