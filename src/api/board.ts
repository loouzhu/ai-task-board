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

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

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
      return member.username || "";
    })
    .filter(Boolean);
};

const normalizeBoard = (board: RawBoard): boardListProps => ({
  ...board,
  boardMembers: normalizeBoardMembers(board.boardMembers),
});

//获取所有看板
export const getAllBoards = async (
  teamId: string,
): Promise<AllBoardsResponse> => {
  const response = await fetch(`/api/board/get-all-boards?teamId=${teamId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await readJson(response);
  console.log(data)

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || "获取看板列表失败");
  }

  if (!data) {
    return { boards: [] };
  }

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
  const data = await readJson(res);

  if (!res.ok) {
    const message =
      data && typeof data === "object"
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || "获取看板信息失败");
  }

  if (!data) {
    return {} as BoardInfoResponse;
  }

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
export const createBoard = async (
  boardName: string,
  boardMembers: string[],
  teamId: string,
) => {
  const response = await fetch("/api/board/create-board", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ boardName, boardMembers, teamId }),
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
  teamId: string,
) => {
  const response = await fetch(`/api/board/edit-board/${teamId}/${boardId}`, {
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
export const deleteBoard = async (boardId: string, teamId: string) => {
  const response = await fetch(`/api/board/delete-board/${teamId}/${boardId}`, {
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
