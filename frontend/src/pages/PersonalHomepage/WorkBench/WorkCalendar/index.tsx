import CalendarCell from "@/components/CalendarCell";
import styles from "./index.module.less";

const lastWeekCounts = [3, 5, 2, 6, 4, 1, 0];
const thisWeekCounts = [4, 7, 3, 5, 2, 1, 0];

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}`;
};

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  const offset = (dayOfWeek + 6) % 7;
  start.setDate(start.getDate() - offset);
  start.setHours(0, 0, 0, 0);
  return start;
};

const buildWeekData = (weekOffset: number, counts: number[]) => {
  const weekStart = getWeekStart(new Date());
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  return counts.map((count, index) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + index);
    return { date: formatDate(dayDate), count };
  });
};

const weeks = [
  { key: "last", days: buildWeekData(-1, lastWeekCounts) },
  { key: "this", days: buildWeekData(0, thisWeekCounts) },
];

export default function WorkCalendar() {
  return (
    <section className={styles.workCalendar}>
      <div className={styles.header}>
        <div className={styles.title}>工作日历</div>
        <div className={styles.subTitle}>上周 / 本周任务量</div>
      </div>
      {weeks.map((week) => (
        <div key={week.key} className={styles.weekBlock}>
          <div className={styles.weekGrid}>
            {week.days.map((day) => (
              <CalendarCell
                key={`${week.key}-${day.date}`}
                date={day.date}
                count={day.count}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
