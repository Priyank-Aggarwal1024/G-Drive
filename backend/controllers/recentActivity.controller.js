import {
  logActivity,
  getUserActivity,
  clearUserActivity,
} from "../services/recentActivity.service.js";

// ✅ Log user activity
export const logActivityController = async (req, res) => {
  try {
    const { userId, itemId, itemType, action, metadata } = req.body;
    const result = await logActivity(
      userId,
      itemId,
      itemType,
      action,
      metadata
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get user activity
export const getUserActivityController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;
    const activities = await getUserActivity(userId, limit);
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Clear user activity
export const clearUserActivityController = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await clearUserActivity(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
