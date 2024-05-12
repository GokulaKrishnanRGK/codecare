import Event from "../models/event.js";

export const searchEvents = async (params = {}, options = {}) => {
  const {skip = 0, limit, sort = {date: 1}} = options;
  return await Event.find(params)
  .sort(sort).skip(skip).limit(limit).lean()
  .exec();
};

export const countEvents = async (params = {}) => {
  return await Event.countDocuments(params).exec();
};

export const getEventDetails = async (id) => {
  return await Event.findById(id).lean().exec();
};

export const createEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

export const updateEventById = async (id, patch) => {
  return Event.findByIdAndUpdate(id, { $set: patch }, { new: true }).exec();

};

export const deleteEvent = async (eventId) => {
  return Event.findByIdAndDelete(eventId);
};

export const registerUser = async (eventId, userId) => {
  return Event.findByIdAndUpdate(
      eventId,
      {$addToSet: {registeredUsers: userId}},
      {new: true}
  ).exec();
};

export const unregisterUser = async (eventId, userId) => {
  return Event.findByIdAndUpdate(
      eventId,
      {$pull: {registeredUsers: userId}},
      {new: true}
  ).exec();
};