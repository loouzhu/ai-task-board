import { Layout } from "@arco-design/web-react";
import { useAllBoards } from "@/hooks/useBoard";
import { useState } from "react";
import type { taskFilterParams } from "@/types/task";
import HeaderNav from "./HeadNav";
import Filter from "./Filter";
import Tasks from "./Tasks";
import "./index.less";

export default function Middle() {
  const Content = Layout.Content;
  const boardList = useAllBoards().data;
  const [filterParams, setFilterParams] = useState<taskFilterParams>({});

  return (
    <Content className="middle">
      <HeaderNav
        boardList={boardList?.boards || []}
        memberList={boardList?.boards?.[0]?.members || []}
      />
      <Filter
        memberList={boardList?.boards?.[0]?.members || []}
        onFilterChange={setFilterParams}
      />
      <Tasks filterParams={filterParams} />
    </Content>
  );
}
