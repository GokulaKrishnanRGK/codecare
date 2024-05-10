import Event from "../models/event.js";

export const searchEvents = async (params = {}, options = {}) => {
  try {
    const {skip = 0, limit = 5, sort = {date: 1}} = options;

    return await Event.find(params)
    .sort(sort).skip(skip).limit(limit)
    .exec();
  } catch (error) {
    throw error;
  }
};

export const countEvents = async (params = {}) => {
  try {
    return await Event.countDocuments(params).exec();
  } catch (error) {
    throw error;
  }
};

export const getEventDetails = async (id) => {
  try {
    return await Event.findById(id).exec();
  } catch (error) {
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const event = new Event(eventData);
    return await event.save();
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (eventDetails) => {
  try {
    const event = new Event(eventDetails);
    return event.save();
  } catch (error) {
    throw error;
  }
}

export const deleteEvent = async (eventId) => {
  try {
    return await Event.findByIdAndDelete(eventId);
  } catch (error) {
    throw error;
  }
};
