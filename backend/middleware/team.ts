import { body } from "express-validator";
import { handleValidation } from "./common";
import User from "../models/User";
import Team from "../models/Team";

const teamNameValidation = body("teamName")
  .trim()
  .notEmpty()
  .withMessage("团队名称不能为空")
  .isLength({ min: 3, max: 8 })
  .withMessage("团队名称长度必须在3-8位之间")
  .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
  .withMessage("团队名称只能包含中文、字母、数字和下划线")
  .custom(async (value, { req }) => {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      return true;
    }

    const normalizedTeamName = String(value).trim();
    const currentTeamId =
      typeof req.params?.teamId === "string" ? req.params.teamId : undefined;

    const existingTeam = await Team.findOne({
      teamName: normalizedTeamName,
      $or: [{ createdBy: currentUserId }, { teamMembers: currentUserId }],
      ...(currentTeamId ? { teamId: { $ne: currentTeamId } } : {}),
    })
      .select("teamId -_id")
      .lean();

    if (existingTeam) {
      throw new Error("团队名称不能与当前用户已参与的团队重复");
    }

    return true;
  });

const membersValidation = body("teamMembers")
  .isArray()
  .withMessage("成员列表必须是数组")
  .custom((items: unknown[]) => items.every((item) => typeof item === "string"))
  .withMessage("成员列表中的每一项都必须是字符串")
  .custom(async (items: string[]) => {
    const uniqueMemberIds = [
      ...new Set(items.map((item) => item.trim())),
    ].filter(Boolean);

    if (!uniqueMemberIds.length) {
      return true;
    }

    const users = await User.find({ userId: { $in: uniqueMemberIds } })
      .select("userId -_id")
      .lean();

    if (users.length !== uniqueMemberIds.length) {
      throw new Error("团队成员必须全部是已存在用户的 userId");
    }

    return true;
  });

export const validateTeam = [
  teamNameValidation,
  membersValidation,
  handleValidation,
];
