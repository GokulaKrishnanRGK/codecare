import User from "../models/user.js";

export const createUser = async (data) => {
  return User.create(data);
};

export const listEmailRecipients = async () => {
  const users = await User.find()
  .select("username firstname lastname")
  .lean()
  .exec();

  return users
  .map((u) => ({
    email: u.username,
    firstName: u.firstname || "",
    lastName: u.lastname || "",
  }))
  .filter((r) => typeof r.email === "string" && r.email.includes("@"));
};

export const findByClerkUserId = async (clerkUserId) => {
  return await User.findOne({clerkUserId}).exec();
};

export const getById = async (id) => User.findById(id).exec();

export const searchUsers = async (params = {}, options = {}) => {
  const {skip = 0, limit = 10, sort = {createdAt: -1}} = options;

  return await User.find(params)
  .select("username firstname lastname role clerkUserId")
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .lean()
  .exec();
};

export const countUsers = async (params = {}) => {
  return await User.countDocuments(params).exec();
};

export const updateUserRoleById = async (userId, role) => {
  return await User.findByIdAndUpdate(
      userId,
      {$set: {role}},
      {new: true, runValidators: true}
  )
  .select("username firstname lastname role clerkUserId")
  .lean()
  .exec();
};
