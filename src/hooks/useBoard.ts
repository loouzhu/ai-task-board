import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Message } from "@arco-design/web-react";
import {
  getAllBoards,
  getBoardInfo,
  createBoard,
  editBoard,
  deleteBoard,
} from "@/api/board";

export const useAllBoards = (teamId: string) => {
  return useQuery({
    queryKey: ["allBoards", teamId],
    queryFn: () => getAllBoards(teamId),
  });
};

export const useGetBoardInfo = (boardId: string) => {
  return useQuery({
    queryKey: ["boardInfo", boardId],
    queryFn: () => getBoardInfo(boardId),
    enabled: !!boardId,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      boardName,
      boardMembers,
    }: {
      teamId: string;
      boardName: string;
      boardMembers: string[];
    }) => createBoard(boardName, boardMembers, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBoards"] });
      Message.success("看板创建成功");
    },
    onError: (error: Error) => {
      Message.error(error.message);
    },
  });
};

export const useEditBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      boardId,
      boardName,
      boardMembers,
    }: {
      teamId: string;
      boardId: string;
      boardName: string;
      boardMembers: string[];
    }) => editBoard(boardId, boardName, boardMembers, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBoards"] });
      queryClient.invalidateQueries({ queryKey: ["boardInfo"] });
      Message.success("看板编辑成功");
    },
    onError: (error: Error) => {
      Message.error(error.message);
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  const { boardId } = useParams();
  return useMutation({
    mutationFn: ({ boardId, teamId }: { boardId: string; teamId: string }) =>
      deleteBoard(boardId, teamId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allBoards"] });
      if (boardId === variables.boardId) {
        queryClient.invalidateQueries({
          queryKey: ["boardInfo", variables.boardId],
        });
      }
      Message.success("看板删除成功");
    },
    onError: (error: Error) => {
      Message.error(error.message);
    },
  });
};
