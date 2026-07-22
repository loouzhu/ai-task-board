import { getUserMap, formatUser } from "./user";

interface BoardLike {
  boardName: string;
  boardId: string;
  teamId: string;
  createdAt: Date;
  createdBy: string;
  boardMembers?: string[];
}

export const formatBoardInfo = async (boards: BoardLike[]) => {
  try {
    const userMap = await getUserMap(
      boards.flatMap((board) => [
        board.createdBy,
        ...(board.boardMembers || []),
      ]),
    );

    return boards.map((board) => ({
      boardName: board.boardName,
      boardId: board.boardId,
      teamId: board.teamId,
      createdAt: board.createdAt,
      createdBy: formatUser(board.createdBy, userMap),
      boardMembers: (board.boardMembers || []).map((memberId) =>
        formatUser(memberId, userMap),
      ),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};
