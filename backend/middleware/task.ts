import { NextFunction, Request, Response } from "express";
import { body, param, query } from "express-validator";
import { handleValidation } from "./common";
import User from "../models/User";

const TASK_PRIORITY_VALUES = ["low", "medium", "high"];
const TASK_STATUS_VALUES = ["pending", "processing", "testing", "completed"];

const boardIdValidation = param("boardId")
  .notEmpty()
  .withMessage("看板ID不能为空")
  .isString()
  .withMessage("看板ID必须是字符串");

const tryParseJson = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const normalizeStringArrayField = (value: unknown) => {
  const parsedValue = tryParseJson(value);

  if (Array.isArray(parsedValue)) {
    return parsedValue;
  }

  if (typeof parsedValue === "string") {
    const trimmedValue = parsedValue.trim();
    return trimmedValue ? [trimmedValue] : [];
  }

  return value;
};

const normalizeTaskMembersToUserIds = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawTaskMembers = req.body?.taskMembers;

    if (!Array.isArray(rawTaskMembers)) {
      return next();
    }

    const normalizedTaskMembers = rawTaskMembers.map((item) =>
      typeof item === "string" ? item.trim() : item,
    );
    const memberIdentifiers = [
      ...new Set(
        normalizedTaskMembers.filter(
          (item): item is string => typeof item === "string" && Boolean(item),
        ),
      ),
    ];

    if (!memberIdentifiers.length) {
      req.body.taskMembers = normalizedTaskMembers;
      return next();
    }

    const users = await User.find({
      $or: [
        { userId: { $in: memberIdentifiers } },
        { username: { $in: memberIdentifiers } },
      ],
    })
      .select("userId username -_id")
      .lean();

    const userIdMap = new Map(users.map((user) => [user.userId, user.userId]));
    const usernameMap = new Map(
      users.map((user) => [user.username, user.userId]),
    );

    req.body.taskMembers = normalizedTaskMembers.map((item) => {
      if (typeof item !== "string") {
        return item;
      }

      return userIdMap.get(item) || usernameMap.get(item) || item;
    });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
};

const normalizeTaskPayload = (req: Request) => {
  req.body = {
    ...req.body,
    taskMembers: normalizeStringArrayField(req.body?.taskMembers),
    subtask: normalizeStringArrayField(req.body?.subtask),
  };

  if (typeof req.body?.files === "string") {
    req.body.files = tryParseJson(req.body.files);
  }

  if (typeof req.body?.has_error === "string") {
    const normalizedHasError = req.body.has_error.trim().toLowerCase();
    if (normalizedHasError === "true" || normalizedHasError === "false") {
      req.body.has_error = normalizedHasError;
    }
  }

  if (typeof req.body?.isBlock === "string") {
    const normalizedIsBlock = req.body.isBlock.trim().toLowerCase();
    if (normalizedIsBlock === "true" || normalizedIsBlock === "false") {
      req.body.isBlock = normalizedIsBlock;
    }
  }

  if (typeof req.body?.isOverdue === "string") {
    const normalizedIsOverdue = req.body.isOverdue.trim().toLowerCase();
    if (normalizedIsOverdue === "true" || normalizedIsOverdue === "false") {
      req.body.isOverdue = normalizedIsOverdue;
    }
  }
};

const mergeTaskPayload = (
  req: Request,
  res: Response,
  payloadFieldNames: string[],
) => {
  for (const payloadFieldName of payloadFieldNames) {
    const rawTaskData = req.body?.[payloadFieldName];

    if (typeof rawTaskData === "string") {
      try {
        const parsedTaskData = JSON.parse(rawTaskData);
        req.body = {
          ...req.body,
          ...parsedTaskData,
        };
        return true;
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "参数验证失败",
          errors: [
            {
              field: payloadFieldName,
              message: "任务数据必须是合法的 JSON",
            },
          ],
        });
        return false;
      }
    }

    if (rawTaskData && typeof rawTaskData === "object") {
      req.body = {
        ...req.body,
        ...rawTaskData,
      };
      return true;
    }
  }

  return true;
};

const normalizeTaskCreatePayload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!mergeTaskPayload(req, res, ["task"])) {
    return;
  }

  normalizeTaskPayload(req);

  console.log(
    "[task:create] normalized req.body =",
    JSON.stringify(req.body, null, 2),
  );
  console.log("[task:create] req.files =", req.files);

  return next();
};

const normalizeTaskUpdatePayload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!mergeTaskPayload(req, res, ["task", "taskData"])) {
    return;
  }

  normalizeTaskPayload(req);
  return next();
};

const taskNumberValidation = body("taskNumber")
  .notEmpty()
  .withMessage("任务编号不能为空")
  .isInt({ min: 1 })
  .withMessage("任务编号必须是大于0的整数")
  .toInt();

const taskNumberOptionalValidation = body("taskNumber")
  .optional({ values: "falsy" })
  .isInt({ min: 1 })
  .withMessage("任务编号必须是大于0的整数")
  .toInt();

const taskNameValidation = body("taskName")
  .trim()
  .notEmpty()
  .withMessage("任务名称不能为空")
  .isLength({ min: 3, max: 8 })
  .withMessage("任务名称长度必须在3-8位之间");

const taskNameOptionalValidation = body("taskName")
  .optional({ values: "falsy" })
  .trim()
  .isLength({ min: 3, max: 8 })
  .withMessage("任务名称长度必须在3-8位之间");

const taskDeadlineValidation = body("taskDeadline")
  .optional({ values: "falsy" })
  .isISO8601()
  .withMessage("任务截止时间格式不正确")
  .toDate();

const taskWorkTimeValidation = body("taskWorkTime")
  .optional({ values: "falsy" })
  .isString()
  .withMessage("任务工时必须是字符串");

const taskMembersValidation = body("taskMembers")
  .optional({ values: "falsy" })
  .isArray()
  .withMessage("任务成员必须是数组")
  .custom((items: unknown[]) => items.every((item) => typeof item === "string"))
  .withMessage("任务成员数组中的每一项都必须是字符串")
  .custom(async (items: string[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      return true;
    }

    const uniqueUserIds = [...new Set(items)];
    const users = await User.find({ userId: { $in: uniqueUserIds } })
      .select("userId -_id")
      .lean();

    if (users.length !== uniqueUserIds.length) {
      throw new Error("任务成员必须全部是已存在用户的 userId");
    }

    return true;
  });

const taskDescriptionValidation = body("taskDescription")
  .optional({ values: "falsy" })
  .trim()
  .isLength({ max: 100 })
  .withMessage("任务描述最多为100个字符");

const taskPriorityValidation = body("taskPriority")
  .notEmpty()
  .withMessage("任务优先级不能为空")
  .isIn(TASK_PRIORITY_VALUES)
  .withMessage("任务优先级必须是: low、medium、high");

const taskStatusValidation = body("taskStatus")
  .notEmpty()
  .withMessage("任务状态不能为空")
  .isIn(TASK_STATUS_VALUES)
  .withMessage("任务状态必须是: pending、processing、testing、completed");

const isBlockValidation = body("isBlock")
  .notEmpty()
  .withMessage("isBlock 不能为空")
  .isBoolean()
  .withMessage("isBlock 必须是布尔类型")
  .toBoolean();

const isBlockOptionalValidation = body("isBlock")
  .optional()
  .isBoolean()
  .withMessage("isBlock 必须是布尔类型")
  .toBoolean();

const blockInfoValidation = body("blockInfo")
  .optional({ values: "falsy" })
  .isString()
  .withMessage("blockInfo 必须是字符串")
  .trim();

const isOverdueValidation = body("isOverdue")
  .notEmpty()
  .withMessage("isOverdue 不能为空")
  .isBoolean()
  .withMessage("isOverdue 必须是布尔类型")
  .toBoolean();

const isOverdueOptionalValidation = body("isOverdue")
  .optional()
  .isBoolean()
  .withMessage("isOverdue 必须是布尔类型")
  .toBoolean();

const overdueInfoValidation = body("overdueInfo")
  .optional({ values: "falsy" })
  .isString()
  .withMessage("overdueInfo 必须是字符串")
  .trim();

const hasErrorValidation = body("has_error")
  .optional()
  .isBoolean()
  .withMessage("has_error 必须是布尔类型")
  .toBoolean();

const subtaskValidation = body("subtask")
  .optional({ values: "falsy" })
  .isArray()
  .withMessage("子任务必须是数组")
  .custom((items: unknown[]) => items.every((item) => typeof item === "string"))
  .withMessage("子任务数组中的每一项都必须是字符串");

const isValidTaskFile = (item: unknown) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return false;
  }

  const candidate = item as Record<string, unknown>;
  const requiredStringFields = [
    "filename",
    "originalname",
    "mimetype",
    "path",
    "url",
  ];

  return (
    requiredStringFields.every(
      (field) => typeof candidate[field] === "string",
    ) && typeof candidate.size === "number"
  );
};

const filesValidation = body("files")
  .optional({ values: "falsy" })
  .isArray()
  .withMessage("附件必须是数组")
  .custom((items: unknown[]) => items.every(isValidTaskFile))
  .withMessage("附件数组中的每一项都必须是合法的附件对象");

export const validateTaskListQuery = [
  query("member")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("成员ID必须是字符串"),
  query("taskPriority")
    .optional({ values: "falsy" })
    .isIn([...TASK_PRIORITY_VALUES, "all"])
    .withMessage("任务优先级必须是: all、low、medium、high"),
  query("taskStatus")
    .optional({ values: "falsy" })
    .isIn([...TASK_STATUS_VALUES, "all"])
    .withMessage(
      "任务状态必须是: all、pending、processing、testing、completed",
    ),
  query("keyword")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("关键词必须是字符串")
    .trim(),
  query("startDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("开始日期格式不正确")
    .toDate(),
  query("endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("结束日期格式不正确")
    .toDate()
    .custom((value, { req }) => {
      if (req.query.startDate && value < req.query.startDate) {
        throw new Error("结束日期不能早于开始日期");
      }
      return true;
    }),
  handleValidation,
];

export const validateTaskCreate = [
  normalizeTaskCreatePayload,
  normalizeTaskMembersToUserIds,
  boardIdValidation,
  taskNumberValidation,
  taskNameValidation,
  taskDeadlineValidation,
  taskWorkTimeValidation,
  taskMembersValidation,
  taskDescriptionValidation,
  taskPriorityValidation,
  taskStatusValidation,
  isBlockValidation,
  blockInfoValidation,
  isOverdueValidation,
  overdueInfoValidation,
  hasErrorValidation,
  subtaskValidation,
  handleValidation,
];

export const validateTaskUpdate = [
  normalizeTaskUpdatePayload,
  normalizeTaskMembersToUserIds,
  boardIdValidation,
  taskNumberOptionalValidation,
  taskNameOptionalValidation,
  taskDeadlineValidation,
  taskWorkTimeValidation,
  taskMembersValidation,
  taskDescriptionValidation,
  body("taskPriority")
    .optional({ values: "falsy" })
    .isIn(TASK_PRIORITY_VALUES)
    .withMessage("任务优先级必须是: low、medium、high"),
  body("taskStatus")
    .optional({ values: "falsy" })
    .isIn(TASK_STATUS_VALUES)
    .withMessage("任务状态必须是: pending、processing、testing、completed"),
  isBlockOptionalValidation,
  blockInfoValidation,
  isOverdueOptionalValidation,
  overdueInfoValidation,
  hasErrorValidation,
  subtaskValidation,
  filesValidation,
  handleValidation,
];
