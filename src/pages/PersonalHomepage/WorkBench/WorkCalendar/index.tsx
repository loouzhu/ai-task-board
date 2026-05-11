import styles from "./index.module.less";

const lastWeek = [
  { date: "05/04", count: 3 },
  { date: "05/05", count: 5 },
  { date: "05/06", count: 2 },
  { date: "05/07", count: 6 },
  { date: "05/08", count: 4 },
  { date: "05/09", count: 1 },
  { date: "05/10", count: 0 },
];

const thisWeek = [
  { date: "05/11", count: 4 },
  { date: "05/12", count: 7 },
  { date: "05/13", count: 3 },
  { date: "05/14", count: 5 },
  { date: "05/15", count: 2 },
  { date: "05/16", count: 1 },
  { date: "05/17", count: 0 },
];

export default function WorkCalendar() {
  return (
    <section className={styles.workCalendar}>
      <div className={styles.header}>
        <div className={styles.title}>工作日历</div>
        <div className={styles.subTitle}>上周 / 本周任务量</div>
      </div>
      <div className={styles.weekBlock}>
        <div className={styles.weekGrid}>
          {lastWeek.map((day) => (
            <div key={`last-${day.date}`} className={styles.dayCell}>
              <div className={styles.dayLabel}>{day.date}</div>
              <div className={styles.dayCount}>{day.count}</div>
              <div className={styles.dayCaption}>tasks</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.weekBlock}>
        <div className={styles.weekGrid}>
          {thisWeek.map((day) => (
            <div key={`this-${day.date}`} className={styles.dayCell}>
              <div className={styles.dayLabel}>{day.date}</div>
              <div className={styles.dayCount}>{day.count}</div>
              <div className={styles.dayCaption}>tasks</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
