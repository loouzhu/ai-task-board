import { useQuery } from "@tanstack/react-query";
import { getBoardTasks } from "@/api/task";
import type { taskFilterParams } from "@/types/task";

export const useGetBoardTasks = (
  boardId: string,
  filterParams?: taskFilterParams,
) => {
  return useQuery({
    queryKey: ["boardTasks", boardId, filterParams],
    queryFn: () => getBoardTasks(boardId, filterParams),
    enabled: !!boardId,
  });
};
