import { Layout } from "@arco-design/web-react";
import { useAllBoards } from "@/hooks/useBoard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetBoardTasks } from "@/hooks/useTask";
import type { task, taskFilterParams } from "@/types/task";
import HeaderNav from "./HeadNav";
import Filter from "./Filter";
import Tasks from "./Tasks";
import "./index.less";

export default function Middle() {
  const Content = Layout.Content;
  const [searchParams, setSearchParams] = useSearchParams();
  const boardList = useAllBoards().data;
  const boards = boardList?.boards || [];
  const boardId = searchParams.get("boardId") || "";
  const [filterParams, setFilterParams] = useState<taskFilterParams>({});
  const tasks = useGetBoardTasks(boardId, filterParams).data?.tasks as
    | task[]
    | undefined;

  useEffect(() => {
    if (!boardId && boards.length > 0) {
      setSearchParams({ boardId: boards[0].boardId }, { replace: true });
    }
  }, [boards, setSearchParams]);

  return (
    <Content className="middle">
      <HeaderNav boardList={boards} memberList={boards?.[0]?.members || []} />
      <Filter
        memberList={boards?.[0]?.members || []}
        onFilterChange={setFilterParams}
      />
      <Tasks tasks={tasks ?? []} />
    </Content>
  );
}
