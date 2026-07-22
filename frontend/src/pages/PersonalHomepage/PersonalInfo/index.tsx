import styles from "./index.module.less";
import BaseInfo from "./BaseInfo";
// import PersonalStatus from "./PersonalStatus";
import ContentHeader from "@/components/ContentHeader";

export default function PersonalInfo() {
  return (
    <div className={styles.personalInfo}>
      <ContentHeader title="个人信息" />
      <div className={styles.section}>
        <BaseInfo />
        {/* <PersonalStatus /> */}
      </div>
    </div>
  );
}
