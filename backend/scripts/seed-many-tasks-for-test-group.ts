import dotenv from "dotenv";
import mongoose from "mongoose";
import Board from "../models/Board";
import Task from "../models/Task";
import Team from "../models/Team";
import User from "../models/User";

dotenv.config();

const TARGET_USERNAMES = ["test", "test1", "test2", "test3", "test4", "test5"];
const BOARD_NAMES = [
  "测试计划",
  "需求池",
  "开发板",
  "联调板",
  "验证板",
  "发布板",
];
const TASK_PREFIXES = [
  "需求",
  "开发",
  "联调",
  "测试",
  "修复",
  "发布",
  "设计",
  "优化",
];
const TASK_SUFFIXES = [
  "跟进",
  "排期",
  "处理",
  "验证",
  "补充",
  "回归",
  "联动",
  "修正",
];
const BLOCK_REASONS = [
  "依赖接口未完成",
  "测试环境异常",
  "需求待确认",
  "资源冲突",
  "排期变更",
];
const DELAY_REASONS = [
  "开发排期后移",
  "联调等待中",
  "测试回归延长",
  "需求变更追加",
  "发布窗口顺延",
];
const SUBTASK_POOL = [
  "确认需求",
  "补充文档",
  "接口开发",
  "页面联调",
  "自测验证",
  "回归复测",
  "上线确认",
  "问题修复",
];

type LeanUser = {
  userId: string;
  username: string;
};

type LeanBoard = {
  boardId: string;
  teamId: string;
  boardName: string;
  boardMembers: string[];
  createdBy: string;
};

const pickOne = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

const pickMany = <T>(items: T[], minCount: number, maxCount: number) => {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const targetCount = Math.min(
    items.length,
    Math.max(
      minCount,
      Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount,
    ),
  );

  return shuffled.slice(0, targetCount);
};

const buildTaskName = (index: number) => {
  const prefix = pickOne(TASK_PREFIXES);
  const suffix = pickOne(TASK_SUFFIXES);
  const serial = String(index % 100).padStart(2, "0");
  return `${prefix}${suffix}${serial}`;
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDateInRange = (start: Date, end: Date) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const value = startTime + Math.random() * (endTime - startTime);
  return new Date(value);
};

const getMonthRanges = () => {
  const now = new Date();

  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );
  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
    0,
  );
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  return {
    currentMonthStart,
    currentMonthEnd,
    previousMonthStart,
    previousMonthEnd,
  };
};

async function ensureTestUsers() {
  const existingUsers = await User.find({
    username: { $in: TARGET_USERNAMES },
  })
    .select("userId username -_id")
    .lean<LeanUser[]>();

  const existingUsernameSet = new Set(
    existingUsers.map((user) => user.username),
  );
  const usersToCreate = TARGET_USERNAMES.filter(
    (username) => !existingUsernameSet.has(username),
  );

  if (usersToCreate.length > 0) {
    await User.insertMany(
      usersToCreate.map((username) => ({
        username,
        password: "12345678",
      })),
    );
  }

  return User.find({ username: { $in: TARGET_USERNAMES } })
    .select("userId username -_id")
    .sort({ username: 1 })
    .lean<LeanUser[]>();
}

async function ensureBoards(
  userIds: string[],
  ownerId: string,
  teamId: string,
) {
  const existingBoards = await Board.find({ createdBy: ownerId, teamId })
    .select("boardId teamId boardName boardMembers createdBy -_id")
    .sort({ createdAt: 1 })
    .lean<LeanBoard[]>();

  const existingNameSet = new Set(
    existingBoards.map((board) => board.boardName),
  );
  const boardNamesToCreate = BOARD_NAMES.filter(
    (name) => !existingNameSet.has(name),
  );

  if (boardNamesToCreate.length > 0) {
    await Board.insertMany(
      boardNamesToCreate.map((boardName) => ({
        teamId,
        boardName,
        createdBy: ownerId,
        boardMembers: userIds,
      })),
    );
  }

  const boards = await Board.find({ createdBy: ownerId, teamId })
    .select("boardId teamId boardName boardMembers createdBy -_id")
    .sort({ createdAt: 1 })
    .lean<LeanBoard[]>();

  await Promise.all(
    boards.map((board) =>
      Board.updateOne(
        { boardId: board.boardId },
        {
          $set: {
            boardMembers: Array.from(
              new Set([...board.boardMembers, ...userIds]),
            ),
          },
        },
      ),
    ),
  );

  return Board.find({ createdBy: ownerId, teamId })
    .select("boardId teamId boardName boardMembers createdBy -_id")
    .sort({ createdAt: 1 })
    .lean<LeanBoard[]>();
}

async function seedManyTasksForTestGroup() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const users = await ensureTestUsers();
  if (users.length === 0) {
    throw new Error("test 组用户准备失败");
  }

  const owner = users.find((user) => user.username === "test") || users[0];
  const userIds = users.map((user) => user.userId);

  let team = await Team.findOne({
    teamName: "测试团队",
    createdBy: owner.userId,
  }).lean();

  if (!team) {
    team = await Team.create({
      teamName: "测试团队",
      createdBy: owner.userId,
      teamMembers: userIds,
    });
  } else {
    await Team.updateOne(
      { teamId: team.teamId },
      {
        $set: {
          teamMembers: Array.from(new Set([...team.teamMembers, ...userIds])),
        },
      },
    );
  }

  const boards = await ensureBoards(userIds, owner.userId, team.teamId);

  const {
    currentMonthStart,
    currentMonthEnd,
    previousMonthStart,
    previousMonthEnd,
  } = getMonthRanges();

  const perBoardTaskCount = 60;
  const payload: Array<Record<string, unknown>> = [];

  for (const board of boards) {
    const maxTask = await Task.findOne({ boardId: board.boardId })
      .sort({ taskNumber: -1 })
      .select("taskNumber -_id")
      .lean<{ taskNumber: number } | null>();

    let taskNumber = maxTask ? maxTask.taskNumber + 1 : 1;

    for (let index = 0; index < perBoardTaskCount; index += 1) {
      const createdAt =
        Math.random() < 0.7
          ? randomDateInRange(currentMonthStart, currentMonthEnd)
          : randomDateInRange(previousMonthStart, previousMonthEnd);

      const deadlineOffsetDays = randomInt(-10, 18);
      const taskDeadline = new Date(createdAt);
      taskDeadline.setDate(taskDeadline.getDate() + deadlineOffsetDays);
      taskDeadline.setHours(randomInt(9, 20), randomInt(0, 59), 0, 0);

      const memberCount =
        userIds.length === 1 ? 1 : randomInt(2, userIds.length);
      const selectedMemberIds = pickMany(
        userIds,
        memberCount,
        userIds.length,
      );
      const createdBy = pickOne(selectedMemberIds);
      const assigneeId = selectedMemberIds[0];
      const collaboratorIds = selectedMemberIds.slice(1);

      const statusRoll = Math.random();
      const taskStatus =
        statusRoll < 0.22
          ? "pending"
          : statusRoll < 0.56
            ? "processing"
            : statusRoll < 0.78
              ? "testing"
              : "completed";

      const priorityRoll = Math.random();
      const taskPriority =
        priorityRoll < 0.3 ? "high" : priorityRoll < 0.7 ? "medium" : "low";

      const isBlock = Math.random() < 0.16;
      const isOverdue = Math.random() < 0.24;
      const hasError = Math.random() < 0.08;
      const subtask = pickMany(SUBTASK_POOL, 2, 4);

      payload.push({
        boardId: board.boardId,
        createdBy,
        taskNumber,
        taskName: buildTaskName(taskNumber + index),
        taskDeadline,
        taskWorkTime: `${randomInt(2, 16)}h`,
        assigneeId,
        collaboratorIds,
        taskDescription: `${board.boardName}任务批量造数-${index + 1}`,
        taskPriority,
        taskStatus,
        isBlock,
        blockInfo: isBlock ? pickOne(BLOCK_REASONS) : "",
        isOverdue,
        overdueInfo: isOverdue ? pickOne(DELAY_REASONS) : "",
        has_error: hasError,
        subtask,
        files: [],
        createdAt,
      });

      taskNumber += 1;
    }
  }

  const insertedTasks = await Task.insertMany(payload);

  const currentMonthCount = insertedTasks.filter((task) => {
    const createdAt = new Date(task.createdAt as Date);
    return createdAt >= currentMonthStart && createdAt <= currentMonthEnd;
  }).length;

  const previousMonthCount = insertedTasks.filter((task) => {
    const createdAt = new Date(task.createdAt as Date);
    return createdAt >= previousMonthStart && createdAt <= previousMonthEnd;
  }).length;

  console.log(
    JSON.stringify(
      {
        success: true,
        users: users.map((user) => ({
          userId: user.userId,
          username: user.username,
        })),
        boardCount: boards.length,
        createdTaskCount: insertedTasks.length,
        currentMonthTaskCount: currentMonthCount,
        previousMonthTaskCount: previousMonthCount,
        boardNames: boards.map((board) => board.boardName),
      },
      null,
      2,
    ),
  );
}

void seedManyTasksForTestGroup()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
