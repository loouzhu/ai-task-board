import React from "react";
import { Layout } from "@arco-design/web-react";
import HeaderNav from "./HeadNav";
import Filter from "./Filter";
import "./index.less";

export default function Middle() {
  const Content = Layout.Content;
  return (
    <Content className="middle">
      <HeaderNav />
      <Filter />
    </Content>
  );
}
