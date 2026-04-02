import { Layout } from "@arco-design/web-react";
import { useAllBoards } from "@/hooks/useBoard";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetBoardTasks } from "@/hooks/useTask";
import type { task, taskFilterParams } from "@/types/task";
import type { boardListProps } from "@/types/board";
import { useBoardStore } from "@/stores/boardStore";
import HeaderNav from "./HeadNav";
import Filter from "./Filter";
import Tasks from "./Tasks";
import "./index.less";

export default function Middle() {
  const Content = Layout.Content;
  const [searchParams, setSearchParams] = useSearchParams();
  const boardList = useAllBoards().data;
  const boards = useMemo<boardListProps[]>(
    () => boardList?.boards ?? [],
    [boardList?.boards],
  );
  const boardId = searchParams.get("boardId") || "";
  const setBoardMembers = useBoardStore((state) => state.setBoardMembers);
  const [filterParams, setFilterParams] = useState<taskFilterParams>({});
  const tasks = useGetBoardTasks(boardId, filterParams).data?.tasks as
    | task[]
    | undefined;
  const currentBoard =
    boards.find((board) => board.boardId === boardId) ?? boards[0];

  useEffect(() => {
    if (!boardId && boards.length > 0) {
      setSearchParams({ boardId: boards[0].boardId }, { replace: true });
    }
  }, [boardId, boards, setSearchParams]);

  useEffect(() => {
    setBoardMembers(currentBoard?.boardMembers ?? []);
  }, [currentBoard, setBoardMembers]);

  return (
    <Content className="middle">
      <HeaderNav
        boardList={boards}
        boardMemberList={currentBoard?.boardMembers || []}
      />
      <Filter
        boardMemberList={currentBoard?.boardMembers || []}
        onFilterChange={setFilterParams}
      />
      <Tasks tasks={tasks ?? []} />
    </Content>
  );
}
