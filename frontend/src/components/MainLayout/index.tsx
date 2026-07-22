import { Layout } from "@arco-design/web-react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import styles from "./index.module.less";

export default function MainLayout() {
  //const Footer = Layout.Footer;

  return (
    <Layout className={styles.layout}>
      <Header />
      <Outlet />
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
}
