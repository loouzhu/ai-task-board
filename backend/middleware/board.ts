import { body } from "express-validator";
import { handleValidation } from "./common";

const teamIdValidation = body("teamId")
  .if((value, { req }) => req.path.includes("/create-board"))
  .notEmpty()
  .withMessage("teamId 不能为空")
  .bail()
  .isString()
  .withMessage("teamId 必须是字符串");

const teamIdParamValidation = body("teamId").custom((value, { req }) => {
  const fromParam =
    typeof req.params?.teamId === "string" ? req.params.teamId : "";
  const fromBody = typeof req.body?.teamId === "string" ? req.body.teamId : "";
  const teamId = fromBody || fromParam || value;

  if (!teamId || typeof teamId !== "string") {
    throw new Error("teamId 不能为空");
  }

  req.body.teamId = teamId;
  return true;
});

const boardNameValidation = body("boardName")
  .trim()
  .notEmpty()
  .withMessage("看板名称不能为空")
  .isLength({ min: 3, max: 8 })
  .withMessage("看板名称长度必须在3-8位之间")
  .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
  .withMessage("看板名称只能包含中文、字母、数字和下划线");

const membersValidation = body("boardMembers")
  .isArray()
  .withMessage("成员列表必须是数组");

export const validateBoard = [
  teamIdValidation,
  teamIdParamValidation,
  boardNameValidation,
  membersValidation,
  handleValidation,
];
