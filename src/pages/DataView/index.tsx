import styles from "./index.module.less";
import { useState } from "react";
import Left from "./Left";
import Right from "./Right";

export default function DataView() {
  const [dateType, setDateType] = useState<"week" | "month">("week");
  return (
    <div className={styles.dataView}>
      <Left dateType={dateType} />
      <Right dateType={dateType} setDateType={setDateType} />
    </div>
  );
}
