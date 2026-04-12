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

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      boardName,
      boardMembers,
    }: {
      boardName: string;
      boardMembers: string[];
    }) => createBoard(boardName, boardMembers),
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
      boardId,
      boardName,
      boardMembers,
    }: {
      boardId: string;
      boardName: string;
      boardMembers: string[];
    }) => editBoard(boardId, boardName, boardMembers),
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
    mutationFn: (boardId: string) => deleteBoard(boardId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allBoards"] });
      if (boardId === variables) {
        queryClient.invalidateQueries({ queryKey: ["boardInfo"] });
      }
      Message.success("看板删除成功");
    },
    onError: (error: Error) => {
      Message.error(error.message);
    },
  });
};
