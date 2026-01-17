import ActivityLog from "../models/activity-log.js";

export const createActivity = async (activityData) => {
  return await new ActivityLog(activityData).save();
}

export const search = async (query, options) => {
  const {skip, limit, sort = {createdAt: -1}} = options;
  return await ActivityLog.find(query)
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .populate("user", "username")
  .lean()
  .exec();
}

export const countActivities = async (params = {}) => {
  return await ActivityLog.countDocuments(params).exec();
}