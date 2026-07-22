import styles from "./index.module.less";
import CardTitle from "@/components/CardTitle";
import TaskStatusBlock from "@/components/TaskStatusBlock";

export default function TaskAggregation() {
  return (
    <section className={styles.taskAggregationCard}>
      <CardTitle title="任务聚合" />
      <div className={styles.taskStatusBlocks}>
        <TaskStatusBlock
          title="待处理"
          data={10}
          description="有10个任务等待处理"
        />
        <TaskStatusBlock
          title="处理中"
          data={5}
          description="有5个任务正在处理"
        />
        <TaskStatusBlock
          title="已完成"
          data={15}
          description="有15个任务已完成"
        />
      </div>
      <div className={styles.todayFocus}>
        <div className={styles.title}>今日聚焦清单</div>
        <ul>
          <li>任务1</li>
          <li>任务2</li>
          <li>任务3</li>
          <li>任务4</li>
          <li>任务5</li>
          <li>任务5</li>
          <li>
            任务5任务5任务5任务5任务5任务5任务5任务5任务5任务5任务5任务5任务5任务5任务5vvvvv
          </li>
          <li>任务5</li>
          <li>任务5</li>
        </ul>
      </div>
    </section>
  );
}
