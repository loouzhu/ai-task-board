import styles from "./index.module.less";
import BaseInfo from "./BaseInfo";
import PersonalStatus from "./PersonalStatus";

export default function PersonalInfo() {
  return (
    <div className={styles.personalInfo}>
      <header>
        <h2>个人资料</h2>
      </header>
      <div className={styles.section}>
        <BaseInfo />
        <PersonalStatus />
      </div>
    </div>
  );
}
