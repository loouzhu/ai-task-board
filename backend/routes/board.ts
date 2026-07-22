import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";
import { validateBoard } from "../middleware/board";
import Board, { BoardRecord } from "../models/Board";
import Task from "../models/Task";
import Team, { TeamRecord } from "../models/Team";
import { formatBoardInfo } from "../utils/board";

const router = express.Router();

router.use(protect);

const canAccessBoard = (
  board: Pick<BoardRecord, "createdBy" | "boardMembers"> | null,
  userId?: string,
) => {
  if (!board || !userId) {
    return false;
  }

  return board.createdBy === userId || board.boardMembers.includes(userId);
};

const canAccessTeam = (
  team: Pick<TeamRecord, "createdBy" | "teamMembers"> | null,
  userId?: string,
) => {
  if (!team || !userId) {
    return false;
  }

  return team.createdBy === userId || team.teamMembers.includes(userId);
};

// 创建看板
router.post(
  "/create-board",
  validateBoard,
  async (req: Request, res: Response) => {
    try {
      const { teamId, boardName, boardMembers } = req.body;
      const ownerId = req.user?.userId;

      if (!ownerId) {
        return res.status(401).json({ success: false, message: "未授权" });
      }

      const team = await Team.findOne({ teamId });
      if (!team) {
        return res.status(404).json({ success: false, message: "团队不存在" });
      }

      if (!canAccessTeam(team, ownerId)) {
        return res
          .status(403)
          .json({ success: false, message: "无权限在该团队下创建看板" });
      }

      const normalizedMembers = Array.isArray(boardMembers) ? boardMembers : [];

      const board = await Board.create({
        teamId,
        boardName,
        boardMembers: normalizedMembers,
        createdBy: ownerId,
      });

      const formattedBoard = (await formatBoardInfo([board.toObject()]))[0];

      return res.status(201).json({
        success: true,
        board: formattedBoard,
        message: "看板创建成功",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  },
);

// 获取当前用户可访问的全部看板
router.get("/get-all-boards", async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.userId;
    const teamId = typeof req.query.teamId === "string" ? req.query.teamId : "";

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "未授权" });
    }

    if (!teamId) {
      return res
        .status(400)
        .json({ success: false, message: "teamId 不能为空" });
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ success: false, message: "团队不存在" });
    }

    if (!canAccessTeam(team, currentUserId)) {
      return res
        .status(403)
        .json({ success: false, message: "无权限访问该团队" });
    }

    const boards = await Board.find({
      teamId,
      $or: [{ createdBy: currentUserId }, { boardMembers: currentUserId }],
    })
      .select("-_id boardName boardId teamId createdAt createdBy boardMembers")
      .lean();

    const formattedBoards = await formatBoardInfo(boards);

    return res.status(200).json({
      success: true,
      message: "获取看板列表成功",
      boards: formattedBoards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

// 获取单个看板详情
router.get("/get-board/:boardId", async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const currentUserId = req.user?.userId;
    const board = await Board.findOne({ boardId });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "看板不存在",
      });
    }

    if (!canAccessBoard(board, currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "无权限访问该看板",
      });
    }

    const formattedBoard = await formatBoardInfo([board.toObject()]);

    return res.status(200).json({
      success: true,
      message: "获取看板信息成功",
      board: formattedBoard[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

// 编辑单个看板
router.put(
  "/edit-board/:teamId/:boardId",
  validateBoard,
  async (req: Request, res: Response) => {
    const { teamId, boardId } = req.params;
    const { boardName, boardMembers } = req.body;

    try {
      const currentUserId = req.user?.userId;
      const team = await Team.findOne({ teamId });

      if (!team) {
        return res.status(404).json({
          success: false,
          message: "团队不存在",
        });
      }

      if (!canAccessTeam(team, currentUserId)) {
        return res.status(403).json({
          success: false,
          message: "无权限编辑该团队下看板",
        });
      }

      const board = await Board.findOne({ boardId });

      if (!board) {
        return res.status(404).json({
          success: false,
          message: "看板不存在",
        });
      }

      if (board.teamId !== teamId) {
        return res.status(400).json({
          success: false,
          message: "teamId 与看板所属团队不匹配",
        });
      }

      if (!canAccessBoard(board, currentUserId)) {
        return res.status(403).json({
          success: false,
          message: "无权限编辑该看板",
        });
      }

      board.boardName = boardName || board.boardName;
      board.boardMembers = Array.isArray(boardMembers)
        ? boardMembers
        : board.boardMembers;

      await board.save();

      return res.status(200).json({
        success: true,
        message: "看板更新成功",
        board: (await formatBoardInfo([board.toObject()]))[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  },
);

// 删除单个看板
router.delete(
  "/delete-board/:teamId/:boardId",
  async (req: Request, res: Response) => {
    const { teamId, boardId } = req.params;

    try {
      const currentUserId = req.user?.userId;
      const team = await Team.findOne({ teamId });

      if (!team) {
        return res.status(404).json({
          success: false,
          message: "团队不存在",
        });
      }

      if (!canAccessTeam(team, currentUserId)) {
        return res.status(403).json({
          success: false,
          message: "无权限删除该团队下看板",
        });
      }

      const board = await Board.findOne({ boardId, teamId });

      if (!board) {
        return res.status(404).json({
          success: false,
          message: "看板不存在",
        });
      }

      if (!canAccessBoard(board, currentUserId)) {
        return res.status(403).json({
          success: false,
          message: "无权限删除该看板",
        });
      }

      await Promise.all([Task.deleteMany({ boardId }), board.deleteOne()]);

      return res.status(200).json({
        success: true,
        message: "看板删除成功",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  },
);

export default router;
