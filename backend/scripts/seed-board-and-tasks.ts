import dotenv from "dotenv";
import mongoose from "mongoose";
import Board from "../models/Board";
import Task from "../models/Task";
import Team from "../models/Team";
import User from "../models/User";

dotenv.config();

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  let user = await User.findOne({}).select("+password");
  if (!user) {
    user = await User.create({
      username: "demo001",
      password: "12345678",
    });
  }

  let team = await Team.findOne({
    teamName: "默认团队",
    createdBy: user.userId,
  }).lean();

  if (!team) {
    team = await Team.create({
      teamName: "默认团队",
      createdBy: user.userId,
      teamMembers: [user.userId],
    });
  }

  const board = await Board.create({
    teamId: team.teamId,
    boardName: "项目看板",
    createdBy: user.userId,
    boardMembers: [user.userId],
  });

  const tasks = await Task.insertMany([
    {
      boardId: board.boardId,
      createdBy: user.userId,
      taskNumber: 1,
      taskName: "需求评审",
      taskDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      taskWorkTime: "4h",
      taskMembers: [user.userId],
      taskDescription: "确认需求范围与验收标准",
      taskPriority: "high",
      taskStatus: "pending",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["梳理需求", "确定边界"],
      files: [],
    },
    {
      boardId: board.boardId,
      createdBy: user.userId,
      taskNumber: 2,
      taskName: "接口开发",
      taskDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      taskWorkTime: "8h",
      taskMembers: [user.userId],
      taskDescription: "完成任务与看板核心接口",
      taskPriority: "medium",
      taskStatus: "processing",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["设计参数", "联调返回"],
      files: [],
    },
    {
      boardId: board.boardId,
      createdBy: user.userId,
      taskNumber: 3,
      taskName: "前端联调",
      taskDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      taskWorkTime: "6h",
      taskMembers: [user.userId],
      taskDescription: "对接接口并修复交互问题",
      taskPriority: "medium",
      taskStatus: "testing",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["页面接入", "状态校验"],
      files: [],
    },
    {
      boardId: board.boardId,
      createdBy: user.userId,
      taskNumber: 4,
      taskName: "测试发布",
      taskDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      taskWorkTime: "5h",
      taskMembers: [user.userId],
      taskDescription: "完成冒烟测试并发布",
      taskPriority: "low",
      taskStatus: "completed",
      isBlock: false,
      blockInfo: "",
      isOverdue: false,
      overdueInfo: "",
      subtask: ["冒烟测试", "发布确认"],
      files: [],
    },
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        userId: user.userId,
        boardId: board.boardId,
        boardName: board.boardName,
        taskCount: tasks.length,
        taskIds: tasks.map((task) => task.taskId),
      },
      null,
      2,
    ),
  );
}

void seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
