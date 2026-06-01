import { Layout } from "@arco-design/web-react";
import { useAllBoards } from "@/hooks/useBoard";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { teamId, boardId } = useParams();
  const boardList = useAllBoards(teamId || "").data;
  const boards = useMemo<boardListProps[]>(
    () => boardList?.boards ?? [],
    [boardList?.boards],
  );
  const fallbackBoardId = boards[0]?.boardId || "";
  const activeBoardId = boardId || fallbackBoardId;
  const setBoardMembers = useBoardStore((state) => state.setBoardMembers);
  const [filterParams, setFilterParams] = useState<taskFilterParams>({});
  const tasks = useGetBoardTasks(activeBoardId, filterParams).data
    ?.tasks as task[];
  const currentBoard =
    boards.find((board) => board.boardId === activeBoardId) ?? boards[0];

  useEffect(() => {
    if (!teamId) return;

    if (boards.length === 0) {
      if (boardId) {
        navigate(`/team/${teamId}/board`, { replace: true });
      }
      return;
    }

    const hasMatchedBoard = boards.some((item) => item.boardId === boardId);
    const nextBoardId = hasMatchedBoard ? boardId : boards[0].boardId;

    if (boardId !== nextBoardId) {
      navigate(`/team/${teamId}/board/${nextBoardId}`, { replace: true });
    }
  }, [boardId, boards, navigate, teamId]);

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
