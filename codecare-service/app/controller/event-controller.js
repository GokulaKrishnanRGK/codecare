import * as eventService from '../services/event-service.js';
import {
  setSuccessResponse,
  setErrorCode,
  setErrorResponseMsg
} from '../utils/response-handler.js';
import {StatusCodes} from "http-status-codes";
import {Status} from "../entities/status-enum.js";
import {storage} from "../storage/index.js";
import * as userService from "../services/user-service.js";
import {sendNewEventEmailToUsers} from "../services/email-service.js";
import {validateEventRequest} from "../validation/validateEventPayload.js";

const PAGE_SIZE = 5;
const allowedTypes = new Set(
    ["image/png", "image/jpeg", "image/webp", "image/gif"]);

const parseDate = (value) => {
  if (!value) {
    return undefined;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const parsePage = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.floor(n);
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

    const eventStatus =
        typeof request.query.eventStatus === "string"
            ? request.query.eventStatus : "";
    if (eventStatus && eventStatus !== Status.ALL) {
      const now = new Date();
      if (eventStatus === Status.UPCOMING) {
        params.date = {...(params.date || {}), $gte: now};
      } else if (eventStatus === Status.COMPLETE) {
        params.date = {...(params.date || {}), $lt: now};
      }
    }

    const page = parsePage(request.query.page);
    const skip = (page - 1) * PAGE_SIZE;

    const total = await eventService.countEvents(params);
    const items = await eventService.searchEvents(params, {
      skip,
      limit: PAGE_SIZE,
      sort: {date: 1},
    });

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    setSuccessResponse(
        StatusCodes.OK,
        {
          items,
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
        },
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
      setErrorResponseMsg("Unsupported image type", res, StatusCodes.UNSUPPORTED_MEDIA_TYPE);
      return;
    }

    const v = validateEventRequest({ req, res, mode: "create" });
    if (!v.ok) return;

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
    .then((recipients) => sendNewEventEmailToUsers({ event: created, recipients }))
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
    setSuccessResponse(StatusCodes.OK, event, response);
  } catch (error) {
    console.log(error)
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
}

export const put = async (req, res) => {
  try {
    const current = await eventService.getEventDetails(req.params.id);
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
    Object.assign(current, v.data);
    if (req.file) {
      const saved = await storage.save({
        folder: "events",
        filename: req.file.originalname,
        buffer: req.file.buffer,
      });
      current.eventImage = saved.key;
    }

    const updated = await eventService.updateEvent(current);
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