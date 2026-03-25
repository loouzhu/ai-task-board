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
  return data;
};
