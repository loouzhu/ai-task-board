import type { boardListProps } from "@/types/board";

interface RawBoardMember {
  userId?: string;
  username?: string;
}

interface RawBoard extends Omit<boardListProps, "boardMembers"> {
  boardMembers?: Array<string | RawBoardMember>;
}

const normalizeBoardMembers = (
  boardMembers?: Array<string | RawBoardMember>,
) => {
  if (!Array.isArray(boardMembers)) {
    return [];
  }
  return boardMembers
    .map((member) => {
      if (typeof member === "string") {
        return member;
      }
      return member.username || member.userId || "";
    })
    .filter(Boolean);
};

const normalizeBoard = (board: RawBoard): boardListProps => ({
  ...board,
  boardMembers: normalizeBoardMembers(board.boardMembers),
});

//获取所有看板
export const getAllBoards = async () => {
  const response = await fetch("/api/board/get-all-boards", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();

  if (Array.isArray(data?.boards)) {
    return {
      ...data,
      boards: data.boards.map((board: RawBoard) => normalizeBoard(board)),
    };
  }

  return data;
};

// 获取单个看板信息
export const getBoardInfo = async (boardId: string) => {
  const res = await fetch(`/api/board/get-board/${boardId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();

  if (data?.board) {
    return {
      ...data,
      board: normalizeBoard(data.board as RawBoard),
    };
  }

  if (data?.boardId) {
    return normalizeBoard(data as RawBoard);
  }

  return data;
};
