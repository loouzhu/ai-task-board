import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User";
import Board from "../models/Board";
import Team from "../models/Team";

dotenv.config();

async function seedMoreBoardsForTest() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const user = await User.findOne({ username: "test" }).lean();
  if (!user) {
    throw new Error("用户 test 不存在，无法创建看板");
  }

  let team = await Team.findOne({
    teamName: "测试团队",
    createdBy: user.userId,
  }).lean();

  if (!team) {
    team = await Team.create({
      teamName: "测试团队",
      createdBy: user.userId,
      teamMembers: [user.userId],
    });
  }

  const boardNames = ["计划池", "开发中", "已完成", "回归测", "产品池"];

  const payload = boardNames.map((boardName) => ({
    teamId: team.teamId,
    boardName,
    createdBy: user.userId,
    boardMembers: [user.userId],
  }));

  const boards = await Board.insertMany(payload);

  console.log(
    JSON.stringify(
      {
        success: true,
        username: user.username,
        userId: user.userId,
        createdCount: boards.length,
        boards: boards.map((board) => ({
          boardId: board.boardId,
          boardName: board.boardName,
          createdAt: board.createdAt,
        })),
      },
      null,
      2,
    ),
  );
}

void seedMoreBoardsForTest()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
