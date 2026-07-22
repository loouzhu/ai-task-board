import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "../models/Task";
import User from "../models/User";

dotenv.config();

async function migrateTaskMemberUsernamesToUserIds() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const distinctTaskMembers = (await Task.distinct("taskMembers")).filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  const users = await User.find({ username: { $in: distinctTaskMembers } })
    .select("userId username -_id")
    .lean();

  const usernameToUserIdMap = new Map(
    users.map((user) => [user.username, user.userId]),
  );

  if (usernameToUserIdMap.size === 0) {
    console.log(
      JSON.stringify(
        {
          success: true,
          modifiedTaskCount: 0,
          matchedUsernames: [],
        },
        null,
        2,
      ),
    );
    return;
  }

  const tasks = await Task.find({
    taskMembers: { $in: [...usernameToUserIdMap.keys()] },
  })
    .select("taskId taskMembers")
    .lean();

  let modifiedTaskCount = 0;

  for (const task of tasks) {
    const originalMembers = Array.isArray(task.taskMembers)
      ? task.taskMembers
      : [];
    const normalizedMembers = Array.from(
      new Set(
        originalMembers.map(
          (member) => usernameToUserIdMap.get(member) || member,
        ),
      ),
    );

    const hasChanged =
      normalizedMembers.length !== originalMembers.length ||
      normalizedMembers.some(
        (member, index) => member !== originalMembers[index],
      );

    if (!hasChanged) {
      continue;
    }

    await Task.updateOne(
      { taskId: task.taskId },
      {
        $set: {
          taskMembers: normalizedMembers,
        },
      },
    );

    modifiedTaskCount += 1;
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        modifiedTaskCount,
        matchedUsernames: [...usernameToUserIdMap.keys()],
      },
      null,
      2,
    ),
  );
}

void migrateTaskMemberUsernamesToUserIds()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
