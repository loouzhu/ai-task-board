import styles from "./index.module.less";
import DataCard from "@/components/DataCard";
import CardTitle from "@/components/CardTitle";

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
      <CardTitle title="本周状态" />
      <div className={styles.content}>
        {/* 工作卡片 */}
        <div className={styles.dataCardContent}>
          {exampleData.map((item, index) => (
            <DataCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
