import { useState } from "react";
import styles from "./index.module.less";
import Sider from "./Sider";
import PersonalInfo from "./PersonalInfo";
import WorkBench from "./WorkBench";

export type PersonalMenuKey = "workbench" | "profile";

export default function PersonalHomePage() {
  const [activeMenu, setActiveMenu] = useState<PersonalMenuKey>("workbench");

  return (
    <div className={styles.personalHomepage}>
      <Sider activeMenu={activeMenu} onChange={setActiveMenu} />
      <main className={styles.content}>
        {activeMenu === "workbench" ? <WorkBench /> : <PersonalInfo />}
      </main>
    </div>
  );
}
