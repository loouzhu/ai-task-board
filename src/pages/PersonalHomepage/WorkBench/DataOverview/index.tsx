import styles from "./index.module.less";
import DataCard from "@/components/DataCard";
import CardTitle from "@/components/CardTitle";
import ProgressCard from "@/components/ProgressCard";

export default function DataOverview() {
  return (
    <section className={styles.dataOverviewCard}>
      <CardTitle title="数据概览" />
      <div className={styles.dataCards}>
        <DataCard
          title="任务完成率"
          data={85}
          unit="%"
          description="相较团队平均值高9%"
          trend="8%"
          bcc="var(--overview-card-2-bg)"
        />
        <DataCard
          title="任务负载"
          data={6}
          unit="个"
          description="仅七天平均工时"
          trend="-2%"
          bcc="var(--overview-card-4-bg)"
        />
      </div>
      {/* 进度统计 */}
      <div className={styles.progressCard}>
        <ProgressCard title="当日进度统计" percent={75} />
        <ProgressCard title="本月任务目标" percent={85} />
      </div>
    </section>
  );
}
