import { useQuery } from "@tanstack/react-query";
import { getAllBoards, getBoardInfo } from "@/api/board";

export const useAllBoards = () => {
  return useQuery({
    queryKey: ["allBoards"],
    queryFn: getAllBoards,
  });
};

export const useGetBoardInfo = (boardId: string) => {
  return useQuery({
    queryKey: ["boardInfo", boardId],
    queryFn: () => getBoardInfo(boardId),
    enabled: !!boardId,
  });
};
