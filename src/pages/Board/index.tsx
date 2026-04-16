import { Layout } from "@arco-design/web-react";
import Middle from "./Middle";
import RightSide from "./Right";
import styles from "./index.module.less";

export default function Board() {
  return (
    <Layout className={styles.board}>
      <Middle />
      <RightSide />
    </Layout>
  );
}
