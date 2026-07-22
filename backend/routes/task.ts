import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { protect } from "../middleware/auth";
import {
  validateTaskCreate,
  validateTaskListQuery,
  validateTaskUpdate,
} from "../middleware/task";
import { uploadFiles } from "../middleware/upload-file";
import Board, { BoardRecord } from "../models/Board";
import Team, { TeamRecord } from "../models/Team";
import Task, { TaskFileRecord } from "../models/Task";
import User from "../models/User";
import { formatTaskInfo } from "../utils/task";
import { getUserMap } from "../utils/user";

const router = express.Router();

router.use(protect);

const getRouteParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

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

const getAccessibleBoard = async (boardId: string, userId?: string) => {
  if (!boardId) {
    return {
      status: 400,
      body: { success: false, message: "boardId 不能为空" },
    };
  }

  const board = await Board.findOne({ boardId });
  if (!board) {
    return { status: 404, body: { success: false, message: "看板不存在" } };
  }

  if (!canAccessBoard(board, userId)) {
    return {
      status: 403,
      body: { success: false, message: "无权限访问该看板" },
    };
  }

  return { board };
};

const getAccessibleTeam = async (teamId: string, userId?: string) => {
  if (!teamId) {
    return {
      status: 400,
      body: { success: false, message: "teamId 不能为空" },
    };
  }

  const team = await Team.findOne({ teamId });
  if (!team) {
    return { status: 404, body: { success: false, message: "团队不存在" } };
  }

  if (!canAccessTeam(team, userId)) {
    return {
      status: 403,
      body: { success: false, message: "无权限访问该团队" },
    };
  }

  return { team };
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;
const WEEK_DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type WeekDayKey = (typeof WEEK_DAY_KEYS)[number];

const getDateRangeByType = (dateType: string) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (dateType === "week") {
    const currentDay = now.getDay();
    const dayOffset = currentDay === 0 ? 6 : currentDay - 1;

    start.setDate(now.getDate() - dayOffset);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  end.setMonth(now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getPreviousDateRangeByType = (
  dateType: string,
  currentStart: Date,
  currentEnd: Date,
) => {
  if (dateType === "week") {
    const start = new Date(currentStart);
    const end = new Date(currentEnd);

    start.setDate(start.getDate() - 7);
    end.setDate(end.getDate() - 7);

    return { start, end };
  }

  const start = new Date(
    currentStart.getFullYear(),
    currentStart.getMonth() - 1,
    1,
    0,
    0,
    0,
    0,
  );
  const end = new Date(
    currentStart.getFullYear(),
    currentStart.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  return { start, end };
};

const calculateChangePercentage = (
  currentValue: number,
  previousValue: number,
) => {
  if (previousValue === 0) {
    if (currentValue === 0) {
      return 0;
    }

    return 100;
  }

  return roundToTwoDecimals(
    ((currentValue - previousValue) / previousValue) * 100,
  );
};

const getMondayBasedDayIndex = (date: Date) => (date.getDay() + 6) % 7;

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const isTaskOverdue = (task: {
  taskStatus: string;
  taskDeadline?: Date | null;
}) =>
  task.taskStatus !== "completed" &&
  Boolean(task.taskDeadline) &&
  new Date(task.taskDeadline as Date) < new Date();

const getTaskAssigneeIds = (task: {
  createdBy: string;
  taskMembers?: string[];
}) => {
  const memberIds =
    Array.isArray(task.taskMembers) && task.taskMembers.length
      ? task.taskMembers
      : [task.createdBy];

  return Array.from(new Set(memberIds.filter(Boolean)));
};

const getMonthWeekRanges = (referenceDate: Date) => {
  const monthStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );
  const monthEnd = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const ranges: Array<{
    key: string;
    startDate: Date;
    endDate: Date;
  }> = [];

  let cursor = new Date(monthStart);
  let weekIndex = 1;

  while (cursor <= monthEnd) {
    const rangeStart = startOfDay(cursor);
    const rangeEnd = endOfDay(cursor);
    const daysUntilSunday = 6 - getMondayBasedDayIndex(rangeStart);

    rangeEnd.setDate(rangeEnd.getDate() + daysUntilSunday);

    if (rangeEnd > monthEnd) {
      rangeEnd.setTime(monthEnd.getTime());
    }

    ranges.push({
      key: `week${weekIndex}`,
      startDate: new Date(rangeStart),
      endDate: new Date(rangeEnd),
    });

    cursor = new Date(rangeEnd);
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
    weekIndex += 1;
  }

  return ranges;
};

type MetricTask = {
  createdBy: string;
  taskStatus: string;
  taskPriority: string;
  isBlock: boolean;
  createdAt: Date;
  taskMembers?: string[];
  taskDeadline?: Date | null;
  taskWorkTime?: string;
};

const getTaskMetrics = (tasks: MetricTask[], teamMemberCount: number) => {
  const totalTaskCount = tasks.length;
  const completedTaskCount = tasks.filter(
    (task) => task.taskStatus === "completed",
  ).length;
  const completionRate =
    totalTaskCount > 0
      ? roundToTwoDecimals((completedTaskCount / totalTaskCount) * 100)
      : 0;

  const now = new Date();
  const overdueTasks = tasks.filter(
    (task) =>
      task.taskStatus !== "completed" &&
      task.taskDeadline &&
      new Date(task.taskDeadline) < now,
  );

  const overdueTaskCount = overdueTasks.length;
  const overdueTaskRate =
    totalTaskCount > 0
      ? roundToTwoDecimals((overdueTaskCount / totalTaskCount) * 100)
      : 0;
  const normalizedTeamMemberCount = Math.max(teamMemberCount, 1);
  const averageTaskLoad = roundToTwoDecimals(
    totalTaskCount / normalizedTeamMemberCount,
  );

  const overdueMediumHighPriorityCount = overdueTasks.filter(
    (task) => task.taskPriority === "medium" || task.taskPriority === "high",
  ).length;

  return {
    totalTaskCount,
    completedTaskCount,
    completionRate,
    overdueTaskCount,
    overdueTaskRate,
    averageTaskLoad,
    overdueMediumHighPriorityCount,
  };
};

const removeUploadedFiles = (
  files: Array<Partial<TaskFileRecord> | Express.Multer.File>,
) => {
  files.forEach((file) => {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

const resolveAssigneeIdNormalizer = async (tasks: MetricTask[]) => {
  const identifiers = Array.from(
    new Set(tasks.flatMap((task) => getTaskAssigneeIds(task))),
  );

  if (!identifiers.length) {
    return (identifier: string) => identifier;
  }

  const users = await User.find({
    $or: [{ userId: { $in: identifiers } }, { username: { $in: identifiers } }],
  })
    .select("userId username -_id")
    .lean<Array<{ userId: string; username: string }>>();

  const userIdMap = new Map(users.map((user) => [user.userId, user.userId]));
  const usernameMap = new Map(
    users.map((user) => [user.username, user.userId]),
  );

  return (identifier: string) =>
    userIdMap.get(identifier) || usernameMap.get(identifier) || identifier;
};

const buildWeeklyMemberTaskRows = async (tasks: MetricTask[]) => {
  const normalizeAssigneeId = await resolveAssigneeIdNormalizer(tasks);
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    normalizedAssigneeIds: Array.from(
      new Set(getTaskAssigneeIds(task).map(normalizeAssigneeId)),
    ),
  }));

  const memberIds = Array.from(
    new Set(normalizedTasks.flatMap((task) => task.normalizedAssigneeIds)),
  );
  const userMap = await getUserMap(memberIds);

  const sortedMembers = memberIds
    .map((userId) => ({
      userId,
      username: userMap.get(userId) || userId,
    }))
    .sort((left, right) =>
      left.username.localeCompare(right.username, "zh-CN"),
    );

  const rows = sortedMembers.map((member, index) => ({
    key: String(index + 1),
    name: member.username,
    userId: member.userId,
    monday: { completed_task: 0, blocked: false, overdue: false },
    tuesday: { completed_task: 0, blocked: false, overdue: false },
    wednesday: { completed_task: 0, blocked: false, overdue: false },
    thursday: { completed_task: 0, blocked: false, overdue: false },
    friday: { completed_task: 0, blocked: false, overdue: false },
    saturday: { completed_task: 0, blocked: false, overdue: false },
    sunday: { completed_task: 0, blocked: false, overdue: false },
    weekTotal: 0,
  }));

  const rowMap = new Map(rows.map((row) => [row.userId, row]));

  normalizedTasks.forEach((task) => {
    if (task.taskStatus !== "completed") {
      return;
    }

    const assigneeIds = task.normalizedAssigneeIds;
    const dayKey =
      WEEK_DAY_KEYS[getMondayBasedDayIndex(new Date(task.createdAt))];
    const overdue = isTaskOverdue(task);

    assigneeIds.forEach((assigneeId) => {
      const row = rowMap.get(assigneeId);
      if (!row) {
        return;
      }

      row[dayKey].completed_task += 1;
      row[dayKey].blocked = row[dayKey].blocked || task.isBlock;
      row[dayKey].overdue = row[dayKey].overdue || overdue;
      row.weekTotal += 1;
    });
  });

  return rows.map(({ userId, ...row }) => row);
};

const buildMonthlyMemberTaskRows = async (
  tasks: MetricTask[],
  monthDate: Date,
) => {
  const weekRanges = getMonthWeekRanges(monthDate);
  const normalizeAssigneeId = await resolveAssigneeIdNormalizer(tasks);
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    normalizedAssigneeIds: Array.from(
      new Set(getTaskAssigneeIds(task).map(normalizeAssigneeId)),
    ),
  }));

  const memberIds = Array.from(
    new Set(normalizedTasks.flatMap((task) => task.normalizedAssigneeIds)),
  );
  const userMap = await getUserMap(memberIds);

  const sortedMembers = memberIds
    .map((userId) => ({
      userId,
      username: userMap.get(userId) || userId,
    }))
    .sort((left, right) =>
      left.username.localeCompare(right.username, "zh-CN"),
    );

  const rows = sortedMembers.map((member, index) => {
    const row: Record<string, unknown> = {
      key: String(index + 1),
      name: member.username,
      userId: member.userId,
      total: 0,
    };

    weekRanges.forEach((weekRange) => {
      row[weekRange.key] = {
        completed_task: 0,
        startDate: weekRange.startDate,
        endDate: weekRange.endDate,
      };
    });

    return row;
  });

  const rowMap = new Map(rows.map((row) => [row.userId as string, row]));

  normalizedTasks.forEach((task) => {
    if (task.taskStatus !== "completed") {
      return;
    }

    const createdAt = new Date(task.createdAt);
    const matchedWeekRange = weekRanges.find(
      (weekRange) =>
        createdAt >= weekRange.startDate && createdAt <= weekRange.endDate,
    );

    if (!matchedWeekRange) {
      return;
    }

    task.normalizedAssigneeIds.forEach((assigneeId) => {
      const row = rowMap.get(assigneeId);
      if (!row) {
        return;
      }

      const weekCell = row[matchedWeekRange.key] as {
        completed_task: number;
        startDate: Date;
        endDate: Date;
      };

      weekCell.completed_task += 1;
      row.total = Number(row.total) + 1;
    });
  });

  return rows.map(({ userId, ...row }) => row);
};

// 在指定看板下创建任务
router.post(
  "/add-task/:boardId",
  uploadFiles,
  validateTaskCreate,
  async (req: Request, res: Response) => {
    try {
      const currentUserId = req.user?.userId;
      const boardId = getRouteParam(req.params.boardId);
      const {
        taskNumber,
        taskName,
        taskDeadline,
        taskWorkTime,
        taskMembers,
        taskDescription,
        taskPriority,
        taskStatus,
        isBlock,
        blockInfo,
        isOverdue,
        overdueInfo,
        has_error,
        subtask,
      } = req.body;

      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "未授权" });
      }

      console.log("req.body JSON =", JSON.stringify(req.body, null, 2));
      console.log("req.files =", req.files);

      const files = Array.isArray(req.files) ? req.files : [];
      const fileInfos: TaskFileRecord[] = files.map((file) => {
        const storedName = file.filename;
        const fileId = path.parse(storedName).name || storedName;

        return {
          fileId,
          filename: storedName,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: `/uploads/tasks/${storedName}`,
          uploadedAt: new Date(),
        };
      });

      const boardAccess = await getAccessibleBoard(boardId, currentUserId);
      if (!("board" in boardAccess)) {
        removeUploadedFiles(fileInfos);
        return res.status(boardAccess.status).json(boardAccess.body);
      }

      const existTask = await Task.findOne({ boardId, taskNumber });
      if (existTask) {
        removeUploadedFiles(fileInfos);
        return res.status(400).json({
          success: false,
          message: "该看板下任务编号已存在",
        });
      }

      const task = await Task.create({
        boardId,
        createdBy: currentUserId,
        taskNumber,
        taskName,
        taskDeadline,
        taskWorkTime,
        taskMembers: Array.isArray(taskMembers) ? taskMembers : [],
        taskDescription,
        taskPriority,
        taskStatus,
        isBlock,
        blockInfo,
        isOverdue,
        overdueInfo,
        has_error,
        subtask: Array.isArray(subtask) ? subtask : [],
        files: fileInfos,
      });

      const formattedTask = (await formatTaskInfo([task.toObject()]))[0];

      return res.status(201).json({
        success: true,
        task: formattedTask,
        message: "任务创建成功",
      });
    } catch (error) {
      console.log(error);
      if (Array.isArray(req.files)) {
        removeUploadedFiles(req.files);
      }
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  },
);

// 获取团队任务统计指标
router.get("/get-task-metrics/:teamId", async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.userId;
    const teamId = getRouteParam(req.params.teamId);
    const dateType =
      typeof req.query.dateType === "string" ? req.query.dateType : "";

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "未授权" });
    }

    const teamAccess = await getAccessibleTeam(teamId, currentUserId);
    if (!("team" in teamAccess)) {
      return res.status(teamAccess.status).json(teamAccess.body);
    }

    const teamMemberCount = Array.from(
      new Set(
        [
          teamAccess.team.createdBy,
          ...(teamAccess.team.teamMembers || []),
        ].filter(Boolean),
      ),
    ).length;

    if (dateType !== "week" && dateType !== "month") {
      return res.status(400).json({
        success: false,
        message: "dateType 只能是 week 或 month",
      });
    }

    const teamBoards = await Board.find({ teamId })
      .select("boardId -_id")
      .lean<Array<{ boardId: string }>>();
    const boardIds = teamBoards.map((board) => board.boardId);
    const { start, end } = getDateRangeByType(dateType);
    const previousRange = getPreviousDateRangeByType(dateType, start, end);

    if (!boardIds.length) {
      return res.status(200).json({
        success: true,
        message: "获取任务指标成功",
        metrics: {
          dateType,
          teamId,
          startDate: start,
          endDate: end,
          previousStartDate: previousRange.start,
          previousEndDate: previousRange.end,
          totalTaskCount: 0,
          completedTaskCount: 0,
          completionRate: 0,
          overdueTaskCount: 0,
          overdueTaskRate: 0,
          averageTaskLoad: 0,
          overdueMediumHighPriorityCount: 0,
          loadUnit: "hour",
          changes: {
            totalTaskCount: {
              previousValue: 0,
              changeValue: 0,
              changePercentage: 0,
            },
            completionRate: {
              previousValue: 0,
              changeValue: 0,
              changePercentage: 0,
            },
            averageTaskLoad: {
              previousValue: 0,
              changeValue: 0,
              changePercentage: 0,
            },
            overdueTaskCount: {
              previousValue: 0,
              changeValue: 0,
              changePercentage: 0,
            },
          },
        },
      });
    }

    const [currentTasks, previousTasks] = await Promise.all([
      Task.find({
        boardId: { $in: boardIds },
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
        .select("taskStatus taskPriority taskDeadline taskWorkTime -_id")
        .lean<MetricTask[]>(),
      Task.find({
        boardId: { $in: boardIds },
        createdAt: {
          $gte: previousRange.start,
          $lte: previousRange.end,
        },
      })
        .select("taskStatus taskPriority taskDeadline taskWorkTime -_id")
        .lean<MetricTask[]>(),
    ]);

    const currentMetrics = getTaskMetrics(currentTasks, teamMemberCount);
    const previousMetrics = getTaskMetrics(previousTasks, teamMemberCount);

    return res.status(200).json({
      success: true,
      message: "获取任务指标成功",
      metrics: {
        dateType,
        teamId,
        startDate: start,
        endDate: end,
        previousStartDate: previousRange.start,
        previousEndDate: previousRange.end,
        totalTaskCount: currentMetrics.totalTaskCount,
        completedTaskCount: currentMetrics.completedTaskCount,
        completionRate: currentMetrics.completionRate,
        overdueTaskCount: currentMetrics.overdueTaskCount,
        overdueTaskRate: currentMetrics.overdueTaskRate,
        averageTaskLoad: currentMetrics.averageTaskLoad,
        overdueMediumHighPriorityCount:
          currentMetrics.overdueMediumHighPriorityCount,
        loadUnit: "hour",
        changes: {
          totalTaskCount: {
            previousValue: previousMetrics.totalTaskCount,
            changeValue:
              currentMetrics.totalTaskCount - previousMetrics.totalTaskCount,
            changePercentage: calculateChangePercentage(
              currentMetrics.totalTaskCount,
              previousMetrics.totalTaskCount,
            ),
          },
          completionRate: {
            previousValue: previousMetrics.completionRate,
            changeValue: roundToTwoDecimals(
              currentMetrics.completionRate - previousMetrics.completionRate,
            ),
            changePercentage: calculateChangePercentage(
              currentMetrics.completionRate,
              previousMetrics.completionRate,
            ),
          },
          averageTaskLoad: {
            previousValue: previousMetrics.averageTaskLoad,
            changeValue: roundToTwoDecimals(
              currentMetrics.averageTaskLoad - previousMetrics.averageTaskLoad,
            ),
            changePercentage: calculateChangePercentage(
              currentMetrics.averageTaskLoad,
              previousMetrics.averageTaskLoad,
            ),
          },
          overdueTaskCount: {
            previousValue: previousMetrics.overdueTaskCount,
            changeValue:
              currentMetrics.overdueTaskCount -
              previousMetrics.overdueTaskCount,
            changePercentage: calculateChangePercentage(
              currentMetrics.overdueTaskCount,
              previousMetrics.overdueTaskCount,
            ),
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

// 获取团队成员周/月任务分布数据
router.get(
  "/get-period-task-data/:teamId",
  async (req: Request, res: Response) => {
    try {
      const currentUserId = req.user?.userId;
      const teamId = getRouteParam(req.params.teamId);
      const dateType =
        typeof req.query.dateType === "string" ? req.query.dateType : "";

      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "未授权" });
      }

      const teamAccess = await getAccessibleTeam(teamId, currentUserId);
      if (!("team" in teamAccess)) {
        return res.status(teamAccess.status).json(teamAccess.body);
      }

      if (dateType !== "week" && dateType !== "month") {
        return res.status(400).json({
          success: false,
          message: "dateType 只能是 week 或 month",
        });
      }

      const teamBoards = await Board.find({ teamId })
        .select("boardId -_id")
        .lean<Array<{ boardId: string }>>();
      const boardIds = teamBoards.map((board) => board.boardId);

      if (!boardIds.length) {
        const { start, end } = getDateRangeByType(dateType);
        return res.status(200).json({
          success: true,
          message: "获取团队成员任务成功",
          dateType,
          teamId,
          startDate: start,
          endDate: end,
          rows: [],
        });
      }

      const { start, end } = getDateRangeByType(dateType);
      const tasks = await Task.find({
        boardId: { $in: boardIds },
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
        .select(
          "createdBy taskMembers taskStatus taskPriority isBlock taskDeadline taskWorkTime createdAt -_id",
        )
        .lean<MetricTask[]>();

      const rows =
        dateType === "week"
          ? await buildWeeklyMemberTaskRows(tasks)
          : await buildMonthlyMemberTaskRows(tasks, start);

      return res.status(200).json({
        success: true,
        message: "获取团队成员任务成功",
        dateType,
        teamId,
        startDate: start,
        endDate: end,
        rows,
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

// 获取单个看板的全部任务
router.get(
  "/get-task-list/:boardId",
  validateTaskListQuery,
  async (req: Request, res: Response) => {
    try {
      const boardId = getRouteParam(req.params.boardId);
      const currentUserId = req.user?.userId;
      const { member, taskPriority, taskStatus, keyword, startDate, endDate } =
        req.query;

      const boardAccess = await getAccessibleBoard(boardId, currentUserId);
      if (!("board" in boardAccess)) {
        return res.status(boardAccess.status).json(boardAccess.body);
      }

      const filters: Record<string, unknown> = { boardId };

      if (member && member !== "all") {
        filters.taskMembers = member;
      }

      if (taskPriority && taskPriority !== "all") {
        filters.taskPriority = taskPriority;
      }

      if (taskStatus && taskStatus !== "all") {
        filters.taskStatus = taskStatus;
      }

      if (typeof keyword === "string" && keyword) {
        filters.taskName = {
          $regex: escapeRegex(keyword),
          $options: "i",
        };
      }

      if (startDate || endDate) {
        filters.taskDeadline = {};

        if (startDate) {
          (filters.taskDeadline as Record<string, unknown>).$gte = startDate;
        }

        if (endDate) {
          const inclusiveEndDate = new Date(endDate as string | Date);
          inclusiveEndDate.setHours(23, 59, 59, 999);
          (filters.taskDeadline as Record<string, unknown>).$lte =
            inclusiveEndDate;
        }
      }

      const tasks = await Task.find(filters)
        .sort({ taskNumber: 1, createdAt: -1 })
        .select("-_id -__v")
        .lean();

      const formattedTasks = await formatTaskInfo(tasks);

      return res.status(200).json({
        success: true,
        tasks: formattedTasks,
        message: "获取任务列表成功",
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

// 编辑指定看板下的单个任务
router.put(
  "/edit-task/:boardId",
  uploadFiles,
  validateTaskUpdate,
  async (req: Request, res: Response) => {
    try {
      const boardId = getRouteParam(req.params.boardId);
      const currentUserId = req.user?.userId;

      const boardAccess = await getAccessibleBoard(boardId, currentUserId);
      if (!("board" in boardAccess)) {
        return res.status(boardAccess.status).json(boardAccess.body);
      }

      const rawTask =
        typeof req.body.task !== "undefined"
          ? req.body.task
          : typeof req.body.taskData !== "undefined"
            ? req.body.taskData
            : null;

      let taskData = req.body;
      if (typeof rawTask === "string") {
        try {
          taskData = JSON.parse(rawTask);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "任务数据格式不正确",
          });
        }
      } else if (rawTask && typeof rawTask === "object") {
        taskData = rawTask;
      }

      const {
        taskId,
        taskNumber,
        taskName,
        taskDeadline,
        taskWorkTime,
        taskMembers,
        taskDescription,
        taskPriority,
        taskStatus,
        isBlock,
        blockInfo,
        isOverdue,
        overdueInfo,
        subtask,
        removeFileIds: removeFileIdsRaw,
      } = taskData;

      const removeFileIds: string[] = (() => {
        if (Array.isArray(removeFileIdsRaw)) {
          return removeFileIdsRaw.filter(
            (id): id is string =>
              typeof id === "string" && id.trim().length > 0,
          );
        }

        if (typeof removeFileIdsRaw === "string" && removeFileIdsRaw.trim()) {
          const trimmed = removeFileIdsRaw.trim();
          if (trimmed.startsWith("[")) {
            try {
              const parsed = JSON.parse(trimmed) as unknown;
              if (Array.isArray(parsed)) {
                return parsed.filter(
                  (id): id is string =>
                    typeof id === "string" && id.trim().length > 0,
                );
              }
            } catch {
              return [trimmed];
            }
          }

          return [trimmed];
        }

        return [];
      })();

      const files = Array.isArray(req.files) ? req.files : [];
      const fileInfos: TaskFileRecord[] = files.map((file) => {
        const storedName = file.filename;
        const fileId = path.parse(storedName).name || storedName;

        return {
          fileId,
          filename: storedName,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: `/uploads/tasks/${storedName}`,
          uploadedAt: new Date(),
        };
      });

      if (!taskId) {
        removeUploadedFiles(fileInfos);
        return res.status(400).json({
          success: false,
          message: "任务ID不能为空",
        });
      }

      const task = await Task.findOne({ taskId, boardId });
      if (!task) {
        removeUploadedFiles(fileInfos);
        return res.status(404).json({
          success: false,
          message: "任务不存在",
        });
      }

      if (typeof taskNumber !== "undefined" && taskNumber !== task.taskNumber) {
        const duplicateTask = await Task.findOne({
          boardId,
          taskNumber,
          taskId: { $ne: task.taskId },
        });

        if (duplicateTask) {
          removeUploadedFiles(fileInfos);
          return res.status(400).json({
            success: false,
            message: "该看板下任务编号已存在",
          });
        }

        task.taskNumber = taskNumber;
      }

      if (typeof taskName !== "undefined") {
        task.taskName = taskName;
      }

      if (typeof taskDeadline !== "undefined") {
        task.taskDeadline = taskDeadline;
      }

      if (typeof taskWorkTime !== "undefined") {
        task.taskWorkTime = taskWorkTime;
      }

      if (typeof taskMembers !== "undefined") {
        task.taskMembers = Array.isArray(taskMembers)
          ? taskMembers
          : task.taskMembers;
      }

      if (typeof taskDescription !== "undefined") {
        task.taskDescription = taskDescription;
      }

      if (typeof taskPriority !== "undefined") {
        task.taskPriority = taskPriority;
      }

      if (typeof taskStatus !== "undefined") {
        task.taskStatus = taskStatus;
      }

      if (typeof isBlock !== "undefined") {
        task.isBlock = isBlock;
      }

      if (typeof blockInfo !== "undefined") {
        task.blockInfo = blockInfo;
      }

      if (typeof isOverdue !== "undefined") {
        task.isOverdue = isOverdue;
      }

      if (typeof overdueInfo !== "undefined") {
        task.overdueInfo = overdueInfo;
      }

      if (typeof subtask !== "undefined") {
        task.subtask = Array.isArray(subtask) ? subtask : task.subtask;
      }

      let nextFiles = Array.isArray(task.files) ? task.files : [];

      if (removeFileIds.length > 0) {
        const removeSet = new Set(removeFileIds);
        const remainingFiles: TaskFileRecord[] = [];
        const removedFiles: TaskFileRecord[] = [];

        nextFiles.forEach((file) => {
          const identifier =
            typeof file.fileId === "string" && file.fileId
              ? file.fileId
              : typeof file.filename === "string" && file.filename
                ? path.parse(file.filename).name || file.filename
                : "";

          if (identifier && removeSet.has(identifier)) {
            removedFiles.push(file);
          } else {
            remainingFiles.push(file);
          }
        });

        removedFiles.forEach((file) => {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });

        nextFiles = remainingFiles;
      }

      if (fileInfos.length > 0) {
        nextFiles = [...nextFiles, ...fileInfos];
      }

      if (removeFileIds.length > 0 || fileInfos.length > 0) {
        task.files = nextFiles;
      }

      await task.save();

      const formattedTask = (await formatTaskInfo([task.toObject()]))[0];

      return res.status(200).json({
        success: true,
        task: formattedTask,
        message: "任务更新成功",
      });
    } catch (error) {
      console.log(error);
      if (Array.isArray(req.files)) {
        removeUploadedFiles(req.files);
      }
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      });
    }
  },
);

// 删除指定看板下的单个任务
router.delete("/delete-task/:boardId", async (req: Request, res: Response) => {
  try {
    const boardId = getRouteParam(req.params.boardId);
    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "boardId 不能为空",
      });
    }

    const { taskId } = req.body;
    const currentUserId = req.user?.userId;
    const task = await Task.findOne({ taskId, boardId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "任务不存在",
      });
    }

    const boardAccess = await getAccessibleBoard(boardId, currentUserId);
    if (!("board" in boardAccess)) {
      return res.status(boardAccess.status).json(boardAccess.body);
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "任务删除成功",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

// 获取重点关注任务
router.get("/focus-on-tasks/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId = getRouteParam(req.params.teamId);
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "用户未登录",
      });
    }

    const teamAccess = await getAccessibleTeam(teamId, currentUserId);
    if (!("team" in teamAccess)) {
      return res.status(teamAccess.status).json(teamAccess.body);
    }

    const teamBoards = await Board.find({ teamId })
      .select("boardId boardName -_id")
      .lean<Array<{ boardId: string; boardName: string }>>();
    const boardIds = teamBoards.map((board) => board.boardId);
    const boardNameMap = new Map(
      teamBoards.map((board) => [board.boardId, board.boardName]),
    );

    if (!boardIds.length) {
      return res.status(200).json({
        success: true,
        tasks: [],
        message: "获取重点关注任务成功",
      });
    }

    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const tasks = await Task.find({
      boardId: { $in: boardIds },
      $or: [
        { taskPriority: "high" },
        {
          taskDeadline: {
            $ne: null,
            $lte: threeDaysLater,
          },
        },
      ],
    });

    const formattedTasks = await formatTaskInfo(tasks.map((t) => t.toObject()));
    const tasksWithBoardName = formattedTasks.map((task) => ({
      ...task,
      boardName:
        boardNameMap.get(String((task as { boardId?: string }).boardId)) || "",
    }));

    return res.status(200).json({
      success: true,
      tasks: tasksWithBoardName,
      message: "获取重点关注任务成功",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "服务器错误",
    });
  }
});

export default router;
