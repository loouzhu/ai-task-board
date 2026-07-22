import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";
import Team, { TeamRecord } from "../models/Team";
import Board from "../models/Board";
import Task from "../models/Task";
import { validateTeam } from "../middleware/team";
import { formatTeamInfo } from "../utils/team";

const router = express.Router();
router.use(protect);

const canAccessTeam = (
  userId: string | undefined,
  team: Pick<TeamRecord, "createdBy" | "teamMembers">,
) => {
  if (!userId || !team) return false;
  return team.createdBy === userId || team.teamMembers.includes(userId);
};

// 创建团队
router.post(
  "/create-team",
  validateTeam,
  async (req: Request, res: Response) => {
    try {
      const { teamName, teamMembers } = req.body;
      const ownerId = req.user?.userId;
      if (!ownerId) {
        return res.status(401).json({ message: "未授权" });
      }
      const normalizedMembers = Array.isArray(teamMembers)
        ? Array.from(
            new Set(teamMembers.map((member) => String(member).trim())),
          ).filter(Boolean)
        : [];
      const team = await Team.create({
        teamName,
        teamMembers: normalizedMembers,
        createdBy: ownerId,
      });
      const formattedTeam = (await formatTeamInfo([team.toObject()]))[0];
      return res.status(200).json({
        success: true,
        team: formattedTeam,
        message: "创建团队成功",
      });
    } catch (err) {
      return res.status(500).json({ message: "创建团队失败,服务端错误" });
    }
  },
);

// 编辑团队
router.put(
  "/edit-team/:teamId",
  validateTeam,
  async (req: Request, res: Response) => {
    try {
      const { teamName, teamMembers } = req.body;
      const teamId = req.params.teamId;
      const ownerId = req.user?.userId;

      if (!ownerId) {
        return res.status(401).json({ message: "未授权" });
      }

      const team = await Team.findOne({ teamId });
      if (!team) {
        return res.status(404).json({ message: "团队不存在" });
      }

      if (team.createdBy !== ownerId) {
        return res.status(403).json({ message: "仅团队创建者可编辑团队" });
      }

      const normalizedMembers = Array.isArray(teamMembers)
        ? Array.from(
            new Set(teamMembers.map((member) => String(member).trim())),
          ).filter(Boolean)
        : [];

      team.teamName = teamName;
      team.teamMembers = normalizedMembers;
      await team.save();

      const formattedTeam = (await formatTeamInfo([team.toObject()]))[0];

      return res.status(200).json({
        success: true,
        team: formattedTeam,
        message: "编辑团队成功",
      });
    } catch (err) {
      return res.status(500).json({ message: "编辑团队失败,服务端错误" });
    }
  },
);

// 删除团队
router.delete("/delete-team/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({ message: "未授权" });
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ message: "团队不存在" });
    }

    if (team.createdBy !== ownerId) {
      return res.status(403).json({ message: "仅团队创建者可删除团队" });
    }

    const boards = await Board.find({ teamId })
      .select("boardId -_id")
      .lean<Array<{ boardId: string }>>();

    const boardIds = boards.map((board) => board.boardId);

    await Promise.all([
      Task.deleteMany({ boardId: { $in: boardIds } }),
      Board.deleteMany({ teamId }),
      team.deleteOne(),
    ]);

    return res.status(200).json({
      success: true,
      message: "删除团队成功",
    });
  } catch (err) {
    return res.status(500).json({ message: "删除团队失败,服务端错误" });
  }
});

// 获取团队信息
router.get("/get-team-info/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "未授权" });
    }

    const team = await Team.findOne({ teamId: teamId });

    if (!team) {
      return res.status(404).json({ message: "团队不存在" });
    }

    if (!canAccessTeam(userId, team)) {
      return res.status(403).json({ message: "无权限访问该团队" });
    }

    const formattedTeam = (await formatTeamInfo([team.toObject()]))[0];

    return res.status(200).json({
      success: true,
      team: formattedTeam,
    });
  } catch (err) {
    return res.status(500).json({ message: "获取团队信息失败,服务端错误" });
  }
});

// 获取个人团队列表
router.get("/get-team-list/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const teams = await Team.find({
      $or: [{ createdBy: userId }, { teamMembers: userId }],
    });
    const formattedTeams = await formatTeamInfo(
      teams.map((team) => team.toObject()),
    );
    return res.status(200).json({
      success: true,
      teams: formattedTeams,
    });
  } catch (err) {
    return res.status(500).json({ message: "获取个人团队列表失败,服务端错误" });
  }
});

export default router;
