import { Layout } from "@arco-design/web-react";
import { useAllBoards } from "@/hooks/useBoard";
import HeaderNav from "./HeadNav";
import Filter from "./Filter";
import Tasks from "./Tasks";
import "./index.less";

export default function Middle() {
  const Content = Layout.Content;
  const boardList = useAllBoards().data;
  console.log(boardList,'boardList');
  return (
    <Content className="middle">
      <HeaderNav
        boardList={boardList?.boards || []}
        memberList={boardList?.boards?.[0]?.members || []}
      />
      <Filter />
      <Tasks />
    </Content>
  );
}
