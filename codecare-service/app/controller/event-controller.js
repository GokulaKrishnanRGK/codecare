import * as eventService from '../services/event-service.js';
import {
  setErrorCode,
  setErrorResponseMsg,
  setSuccessResponse
} from '../utils/response-handler.js';
import {StatusCodes} from "http-status-codes";
import {Status} from "../entities/status-enum.js";
import {storage} from "../storage/index.js";
import * as userService from "../services/user-service.js";
import {
  sendEventRegistrationEmail,
  sendNewEventEmailToUsers
} from "../services/email-service.js";
import {validateEventRequest} from "../validation/validateEventPayload.js";
import Event from "../models/event.js";
import {getCurrentUserFromClerk} from "../utils/auth-user.js";
import {calcTotalPages, getPagination} from "../utils/pagination.js";

const allowedTypes = new Set(
    ["image/png", "image/jpeg", "image/webp", "image/gif"]);

const parseDate = (value) => {
  if (!value) {
    return undefined;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const toPublicEventDto = (eventObj, currentUserId) => {
  const registeredIds = Array.isArray(eventObj.registeredUsers)
      ? eventObj.registeredUsers : [];
  const attendedIds = Array.isArray(eventObj.attendedUsers)
      ? eventObj.attendedUsers : [];

  const registeredCount = registeredIds.length;
  const attendedCount = attendedIds.length;

  const isRegistered =
      currentUserId != null && registeredIds.some(
          (id) => String(id) === String(currentUserId));

  const {registeredUsers, attendedUsers, _id, ...rest} = eventObj;

  return {
    id: _id,
    ...rest,
    registeredCount,
    attendedCount,
    isRegistered,
  };
};

export const search = async (request, response) => {
  try {
    const params = {};

    const keyword =
        typeof request.query.keyword === "string" ? request.query.keyword.trim()
            : "";
    if (keyword) {
      params.$or = [
        {title: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"}},
      ];
    }

    const location =
        typeof request.query.location === "string"
            ? request.query.location.trim() : "";
    if (location) {
      params["location.city"] = location;
    }

    const fromDate = parseDate(request.query.fromDate);
    const toDate = parseDate(request.query.toDate);

    if (fromDate || toDate) {
      params.date = {};
      if (fromDate) {
        params.date.$gte = fromDate;
      }
      if (toDate) {
        params.date.$lte = toDate;
      }
    }

    const rawStatus =
        typeof request.query.eventStatus === "string"
            ? request.query.eventStatus : "";
    const eventStatus =
        rawStatus === Status.COMPLETE ? Status.COMPLETE : Status.UPCOMING;

    const now = new Date();
    if (eventStatus === Status.UPCOMING) {
      params.endTime = {...(params.endTime || {}), $gte: now};
    } else {
      params.endTime = {...(params.endTime || {}), $lt: now};
    }

    const {page, pageSize, skip, limit} = getPagination(request.query.page);

    const total = await eventService.countEvents(params);
    const items = await eventService.searchEvents(params, {
      skip,
      limit,
      sort: {date: 1},
    });

    const totalPages = calcTotalPages(total, pageSize);

    const user = await getCurrentUserFromClerk(request);
    const currentUserId = user?.id;

    const normalizedItems = items.map(
        (e) => toPublicEventDto(e, currentUserId));

    setSuccessResponse(
        StatusCodes.OK,
        {items: normalizedItems, page, pageSize, total, totalPages},
        response
    );
  } catch (error) {
    console.log(error);
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
};

export const post = async (req, res) => {
  try {
    if (req.file && !allowedTypes.has(req.file.mimetype)) {
      setErrorResponseMsg("Unsupported image type", res,
          StatusCodes.UNSUPPORTED_MEDIA_TYPE);
      return;
    }

    const v = validateEventRequest({req, res, mode: "create"});
    if (!v.ok) {
      return;
    }

    const saved = await storage.save({
      folder: "events",
      filename: req.file.originalname,
      buffer: req.file.buffer,
    });

    const created = await eventService.createEvent({
      ...v.data,
      eventImage: saved.key,
    });

    userService
    .listEmailRecipients()
    .then(
        (recipients) => sendNewEventEmailToUsers({event: created, recipients}))
    .catch((err) => console.log("Email send failed:", err));

    setSuccessResponse(StatusCodes.OK, created, res);
  } catch (err) {
    console.log(err);
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, res);
  }
};

export const get = async (request, response) => {
  try {
    const event = await eventService.getEventDetails(request.params.id);
    if (!event) {
      setErrorCode(StatusCodes.NOT_FOUND, response);
      return;
    }
    let user = await getCurrentUserFromClerk(request);
    let currentUserId = user?.id;
    const payload = toPublicEventDto(event, currentUserId);
    setSuccessResponse(StatusCodes.OK, payload, response);
  } catch (error) {
    console.log(error);
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
};

export const put = async (req, res) => {
  try {
    const id = req.params.id;

    const current = await eventService.getEventDetails(id);
    if (!current) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    if (req.file && !allowedTypes.has(req.file.mimetype)) {
      setErrorResponseMsg("Unsupported image type", res, StatusCodes.UNSUPPORTED_MEDIA_TYPE);
      return;
    }

    const v = validateEventRequest({ req, res, mode: "update" });
    if (!v.ok) return;

    const patch = { ...v.data };

    if (req.file) {
      const saved = await storage.save({
        folder: "events",
        filename: req.file.originalname,
        buffer: req.file.buffer,
      });
      patch.eventImage = saved.key;
    }

    const updated = await eventService.updateEventById(id, patch);

    setSuccessResponse(StatusCodes.OK, updated, res);
  } catch (error) {
    console.log(error);
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, res);
  }
};

export const deleteEvent = async (request, response) => {
  try {
    const id = request.params.id;
    const event = await eventService.deleteEvent(id);
    setSuccessResponse(StatusCodes.OK, event, response);
  } catch (error) {
    console.log(error)
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
}

export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id;
    if (!userId) {
      setErrorCode(StatusCodes.UNAUTHORIZED, res);
      return;
    }
    const event = await Event.findById(eventId).select(
        "_id endTime").lean().exec();
    if (!event) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }
    if (new Date(event.endTime).getTime() < Date.now()) {
      setErrorResponseMsg("Cannot register for a past event", res,
          StatusCodes.BAD_REQUEST);
      return;
    }
    const updated = await eventService.registerUser(eventId, userId);
    const [eventDoc, userDoc] = await Promise.all([
      Event.findById(eventId).lean().exec(),
      userService.getById(userId),
    ]);
    if (userDoc?.emailSubscribed !== false) {
      sendEventRegistrationEmail({event: eventDoc, user: userDoc})
      .catch((e) => console.log("Registration email failed:", e));
    }
    setSuccessResponse(StatusCodes.OK, {id: updated._id}, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const unregisterForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id;
    if (!userId) {
      setErrorCode(StatusCodes.UNAUTHORIZED, res);
      return;
    }
    const event = await Event.findById(eventId).select(
        "_id endTime").lean().exec();
    if (!event) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    if (new Date(event.endTime).getTime() < Date.now()) {
      setErrorResponseMsg("Cannot unregister from a past event", res,
          StatusCodes.BAD_REQUEST);
      return;
    }

    const updated = await eventService.unregisterUser(eventId, userId);
    setSuccessResponse(StatusCodes.OK, {id: updated._id}, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
