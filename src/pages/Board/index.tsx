import { Layout, Empty } from "@arco-design/web-react";
//import LeftSide from "./Left";
import Middle from "./Middle";
import RightSide from "./Right";
import styles from "./index.module.less";

export default function Board() {
  const data = "1";
  return (
    <Layout className={styles.board}>
      {/* <LeftSide /> */}
      {data ? (
        <>
          <Middle />
          <RightSide />
        </>
      ) : (
        <Empty description="暂无数据" />
      )}
    </Layout>
  );
}
