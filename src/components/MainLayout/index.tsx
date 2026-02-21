import React from "react";
import { Layout } from "@arco-design/web-react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import "./index.less";

export default function MainLayout() {
  //const Footer = Layout.Footer;

  return (
    <Layout className="layout">
      <Header />
      <Outlet />
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
}
