import RecentActivity from "../models/RecentActivity.js";

// ✅ Log user activity
export const logActivity = async (
  userId,
  itemId,
  itemType,
  action,
  metadata = {}
) => {
  if (!userId || !itemId || !itemType || !action) {
    throw new Error("Missing required fields");
  }

  const newActivity = new RecentActivity({
    userId,
    itemId,
    itemType,
    action,
    metadata,
  });
  await newActivity.save();
  return { message: "Activity logged successfully" };
};

// ✅ Get recent activity for a user
export const getUserActivity = async (userId, limit = 20) => {
  if (!userId) throw new Error("User ID is required");

  return await RecentActivity.find({ userId })
    .sort({ timestamp: -1 }) // Sort by most recent first
    .limit(limit)
    .populate("itemId", "name");
};

// ✅ Clear user activity
export const clearUserActivity = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  await RecentActivity.deleteMany({ userId });
  return { message: "User activity cleared successfully" };
};
