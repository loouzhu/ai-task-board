import { useQuery } from "@tanstack/react-query";
import { getBoardTasks } from "@/api/task";

export const useGetBoardTasks = (boardId: string) => {
  return useQuery({
    queryKey: ["boardTasks", boardId],
    queryFn: () => getBoardTasks(boardId),
  });
};
