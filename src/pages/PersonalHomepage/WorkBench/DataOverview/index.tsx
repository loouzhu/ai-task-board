import styles from "./index.module.less";
import CardTitle from "@/components/CardTitle";

export default function DataOverview() {
  return (
    <section className={styles.dataOverviewCard}>
      <CardTitle title="数据概览" />
    </section>
  );
}
