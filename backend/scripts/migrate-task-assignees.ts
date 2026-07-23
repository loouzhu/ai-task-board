import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "../models/Task";
import User from "../models/User";

dotenv.config();

interface LegacyTaskDocument {
  _id: mongoose.Types.ObjectId;
  createdBy?: string;
  taskMembers?: string[];
  assigneeId?: string;
  collaboratorIds?: string[];
}

async function migrateTaskAssignees() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI 未配置");
  }

  await mongoose.connect(mongoUri);

  const tasks = (await Task.collection
    .find({
      $or: [
        { taskMembers: { $exists: true } },
        { assigneeId: { $exists: false } },
      ],
    })
    .toArray()) as unknown as LegacyTaskDocument[];

  const identifiers = Array.from(
    new Set(
      tasks.flatMap((task) => [
        task.createdBy,
        task.assigneeId,
        ...(task.taskMembers || []),
        ...(task.collaboratorIds || []),
      ]),
    ),
  ).filter((identifier): identifier is string => Boolean(identifier));

  const users = await User.find({
    $or: [{ userId: { $in: identifiers } }, { username: { $in: identifiers } }],
  })
    .select("userId username -_id")
    .lean();

  const userIdMap = new Map(users.map((user) => [user.userId, user.userId]));
  const usernameMap = new Map(
    users.map((user) => [user.username, user.userId]),
  );
  const toUserId = (identifier?: string) =>
    identifier
      ? userIdMap.get(identifier) || usernameMap.get(identifier) || identifier
      : "";

  const operations = tasks.flatMap((task) => {
    const legacyMembers = Array.isArray(task.taskMembers)
      ? task.taskMembers
      : [];
    const assigneeId = toUserId(
      task.assigneeId || legacyMembers[0] || task.createdBy,
    );

    if (!assigneeId) {
      return [];
    }

    const collaboratorIds = Array.from(
      new Set(
        (task.collaboratorIds || legacyMembers.slice(1))
          .map(toUserId)
          .filter((userId) => userId && userId !== assigneeId),
      ),
    );

    return [
      {
        updateOne: {
          filter: { _id: task._id },
          update: {
            $set: { assigneeId, collaboratorIds },
            $unset: { taskMembers: "" },
          },
        },
      },
    ];
  });

  const result = operations.length
    ? await Task.collection.bulkWrite(operations)
    : { matchedCount: 0, modifiedCount: 0 };

  console.log(
    JSON.stringify(
      {
        success: true,
        scannedTaskCount: tasks.length,
        matchedTaskCount: result.matchedCount,
        modifiedTaskCount: result.modifiedCount,
      },
      null,
      2,
    ),
  );
}

void migrateTaskAssignees()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
