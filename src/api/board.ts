import type { boardListProps } from "@/types/board";

interface AllBoardsResponse {
  boards: boardListProps[];
  [key: string]: unknown;
}

interface BoardInfoResponse {
  board?: boardListProps;
  [key: string]: unknown;
}

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
export const getAllBoards = async (): Promise<AllBoardsResponse> => {
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

  return data as AllBoardsResponse;
};

// 获取单个看板信息
export const getBoardInfo = async (
  boardId: string,
): Promise<BoardInfoResponse | boardListProps> => {
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

  return data as BoardInfoResponse;
};

// 创建看板
export const createBoard = async (boardName: string, boardMembers: string[]) => {
  const response = await fetch("/api/board/create-board", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ boardName, boardMembers }),
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("看板参数错误");
    } else if (response.status === 401) {
      throw new Error("未授权");
    } else if (response.status === 500) {
      throw new Error("服务器错误");
    } else {
      throw new Error("创建看板失败");
    }
  }
  const data = await response.json();
  return data;
};

// 编辑看板
export const editBoard = async (
  boardId: string,
  boardName: string,
  boardMembers: string[],
) => {
  const response = await fetch(`/api/board/edit-board/${boardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ boardName, boardMembers }),
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("看板参数错误");
    } else if (response.status === 401) {
      throw new Error("未授权");
    } else if (response.status === 500) {
      throw new Error("服务器错误");
    } else {
      throw new Error("编辑看板失败");
    }
  }
  const data = await response.json();
  return data;
};

// 删除看板
export const deleteBoard = async (boardId: string) => {
  const response = await fetch(`/api/board/delete-board/${boardId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("看板参数错误");
    } else if (response.status === 401) {
      throw new Error("未授权");
    } else if (response.status === 500) {
      throw new Error("服务器错误");
    } else {
      throw new Error("删除看板失败");
    }
  }
  const data = await response.json();
  return data;
};
