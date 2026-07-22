import User from "../models/User";

export interface FormattedUser {
  userId: string | null | undefined;
  username: string | null;
}

export const getUserMap = async (userIds: Array<string | null | undefined>) => {
  const normalizedUserIds = [
    ...new Set((userIds || []).filter(Boolean)),
  ] as string[];

  if (!normalizedUserIds.length) {
    return new Map<string, string>();
  }

  const users = await User.find({ userId: { $in: normalizedUserIds } })
    .select("userId username -_id")
    .lean();

  return new Map<string, string>(
    users.map((user) => [user.userId, user.username]),
  );
};

export const formatUser = (
  userId: string | null | undefined,
  userMap: Map<string, string>,
): FormattedUser => ({
  userId,
  username: userId ? userMap.get(userId) || null : null,
});
