import styles from "./index.module.less";
import ContentHeader from "@/components/ContentHeader";

export default function WorkBench() {
  return (
    <div className={styles.workBench}>
      <ContentHeader
        title="个人工作台"
        description="聚合你在团队中的任务，节奏和风险点"
      />
    </div>
  );
}
