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
import styles from "./index.module.less";

export default function Middle() {
  const Content = Layout.Content;
  const [searchParams, setSearchParams] = useSearchParams();
  const boardList = useAllBoards().data;
  const boards = useMemo<boardListProps[]>(
    () => boardList?.boards ?? [],
    [boardList?.boards],
  );
  const urlBoardId = searchParams.get("boardId") || "";
  const fallbackBoardId = boards[0]?.boardId || "";
  const boardId = urlBoardId || fallbackBoardId;
  const setBoardMembers = useBoardStore((state) => state.setBoardMembers);
  const [filterParams, setFilterParams] = useState<taskFilterParams>({});
  const tasks = useGetBoardTasks(boardId, filterParams).data?.tasks as task[];
  const currentBoard =
    boards.find((board) => board.boardId === boardId) ?? boards[0];

  useEffect(() => {
    if (boards.length === 0) return;
    const hasMatchedBoard = boards.some(
      (board) => board.boardId === urlBoardId,
    );
    const nextBoardId = hasMatchedBoard ? urlBoardId : boards[0].boardId;

    if (urlBoardId !== nextBoardId) {
      setSearchParams({ boardId: nextBoardId }, { replace: true });
    }
  }, [urlBoardId, boards, setSearchParams]);

  useEffect(() => {
    setBoardMembers(currentBoard?.boardMembers ?? []);
  }, [currentBoard, setBoardMembers]);

  return (
    <Content className={styles.middle}>
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
