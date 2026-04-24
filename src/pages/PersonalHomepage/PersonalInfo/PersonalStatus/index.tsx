import styles from "./index.module.less";
import ProgressCard from "@/components/ProgressCard";
import DataCard from "@/components/DataCard";

export default function PersonalStatus() {
  const exampleData = [
    {
      title: "准时交付率",
      data: 92,
      unit: "%",
      description: "近四周平均水平",
      trend: "14%",
      bcc: "var(--overview-card-2-bg)",
    },
    {
      title: "跨团队协作",
      data: 18,
      unit: "次",
      description: "本月累计次数",
      trend: "-3%",
      bcc: "var(--overview-card-4-bg)",
    },
  ];

  return (
    <section className={styles.statusCard}>
      <div className={styles.content}>
        {/* 工作卡片 */}
        <div className={styles.dataCardContent}>
          {exampleData.map((item, index) => (
            <DataCard key={index} {...item} />
          ))}
        </div>
        {/* 进度统计 */}
        <div className={styles.progressCard}>
          <ProgressCard title="进度统计" percent={75} />
        </div>
      </div>
    </section>
  );
}
