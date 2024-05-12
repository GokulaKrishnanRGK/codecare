import User from "../models/user.js";

export const createUser = async (data) => {
  return User.create(data);
};

export const listEmailRecipients = async () => {
  const users = await User.find()
  .select("username firstname lastname")
  .where("emailSubscribed").equals(true)
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
  const {skip = 0, limit, sort = {createdAt: -1}} = options;

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

export const addVaccinationToUser = async (userId, vaccinationId) => {
  return User.findByIdAndUpdate(
      userId,
      {$addToSet: {vaccinations: vaccinationId}},
      {new: true, runValidators: true}
  )
  .select("username firstname lastname role vaccinations clerkUserId emailSubscribed")
  .lean()
  .exec();
};

export const removeVaccinationFromUser = async (userId, vaccinationId) => {
  return User.findByIdAndUpdate(
      userId,
      {$pull: {vaccinations: vaccinationId}},
      {new: true, runValidators: true}
  )
  .select("username firstname lastname role vaccinations clerkUserId")
  .lean()
  .exec();
};

export const getByIdWithVaccinations = async (id) => {
  return User.findById(id)
  .populate("vaccinations", "name description")
  .select(
      "username firstname lastname role vaccinations clerkUserId emailSubscribed")
  .lean()
  .exec();
};

export const updateEmailSubscription = async (userId, emailSubscribed) => {
  return User.findByIdAndUpdate(
      userId,
      {$set: {emailSubscribed: Boolean(emailSubscribed)}},
      {new: true, runValidators: true}
  )
  .select("emailSubscribed")
  .lean()
  .exec();
};
