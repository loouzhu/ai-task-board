import styles from "./index.module.less";
import ContentHeader from "@/components/ContentHeader";
import DataOverview from "./DataOverview";
import TaskAggregation from "./TaskAggregation";
import WorkCalendar from "./WorkCalendar";

export default function WorkBench() {
  return (
    <div className={styles.workBench}>
      <ContentHeader
        title="个人工作台"
        description="聚合你在团队中的任务，节奏和风险点"
      />
      <div className={styles.content}>
        <div className={styles.taskAggregation}>
          <TaskAggregation />
        </div>
        <div className={styles.dataOverview}>
          <DataOverview />
        </div>
        <div className={styles.workCalendar}>
          <WorkCalendar />
        </div>
      </div>
    </div>
  );
}
