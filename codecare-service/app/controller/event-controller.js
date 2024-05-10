import * as eventService from '../services/event-service.js';
import {setSuccessResponse, setErrorCode} from '../utils/response-handler.js';
import {StatusCodes} from "http-status-codes";
import {Status} from "../entities/status-enum.js";

const PAGE_SIZE = 5;

const parseDate = (value) => {
  if (!value) {
    return undefined;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const parsePage = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
};

export const search = async (request, response) => {
  try {
    const params = {};

    const keyword =
        typeof request.query.keyword === "string" ? request.query.keyword.trim() : "";
    if (keyword) {
      params.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const location =
        typeof request.query.location === "string" ? request.query.location.trim() : "";
    if (location) {
      params["location.city"] = location;
    }

    const fromDate = parseDate(request.query.fromDate);
    const toDate = parseDate(request.query.toDate);

    if (fromDate || toDate) {
      params.date = {};
      if (fromDate) params.date.$gte = fromDate;
      if (toDate) params.date.$lte = toDate;
    }

    const eventStatus =
        typeof request.query.eventStatus === "string" ? request.query.eventStatus : "";
    if (eventStatus && eventStatus !== Status.ALL) {
      const now = new Date();
      if (eventStatus === Status.UPCOMING) {
        params.date = { ...(params.date || {}), $gte: now };
      } else if (eventStatus === Status.COMPLETE) {
        params.date = { ...(params.date || {}), $lt: now };
      }
    }

    const page = parsePage(request.query.page);
    const skip = (page - 1) * PAGE_SIZE;

    const total = await eventService.countEvents(params);
    const items = await eventService.searchEvents(params, {
      skip,
      limit: PAGE_SIZE,
      sort: { date: 1 }, // upcoming soonest first
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

export const post = async (request, response) => {
  try {
    const event = await eventService.createEvent({...request.body});
    setSuccessResponse(StatusCodes.OK, event, response);
  } catch (error) {
    console.log(error)
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
}

export const get = async (request, response) => {
  try {
    const event = await eventService.getEventDetails(request.params.id);
    setSuccessResponse(StatusCodes.OK, event, response);
  } catch (error) {
    console.log(error)
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
}

export const put = async (request, response) => {
  try {
    const event = {...request.body};
    const currentEvent = await eventService.getEventDetails(request.params.id);
    if (event.type) {
      currentEvent.type = event.type;
    }
    if (event.date) {
      currentEvent.date = event.date;
    }
    if (event.title) {
      currentEvent.title = event.title;
    }
    if (event.description) {
      currentEvent.description = event.description;
    }
    if (event.organizer) {
      currentEvent.organizer = event.organizer;
    }
    if (event.contactInfo) {
      currentEvent.contactInfo = event.contactInfo;
    }
    if (event.location) {
      currentEvent.location = event.location;
    }
    if (event.eventImage) {
      currentEvent.eventImage = event.eventImage;
    }
    const updatedEvent = await eventService.updateEvent(currentEvent);
    setSuccessResponse(StatusCodes.OK, updatedEvent, response);
  } catch (error) {
    console.log(error)
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
}

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