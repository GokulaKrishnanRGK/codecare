import {StatusCodes} from "http-status-codes";
import {
  setErrorCode,
  setErrorResponseMsg,
  setSuccessResponse
} from "../utils/response-handler.js";
import Event from "../models/event.js";
import Vaccination from "../models/vaccination.js";
import * as userService from "../services/user-service.js";
import {sendVaccinationMarkedEmail} from "../services/email-service.js";

export const getEventRegistrations = async (req, res) => {
  try {
    const {eventId} = req.params;

    const event = await Event.findById(eventId)
    .select("title date registeredUsers")
    .populate({
      path: "registeredUsers",
      select: "username firstname lastname vaccinations",
      populate: {path: "vaccinations", select: "name description"},
    })
    .lean()
    .exec();

    if (!event) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    const vaccinations = await Vaccination.find({})
    .select("name description")
    .sort({name: 1})
    .lean()
    .exec();

    const users = (event.registeredUsers ?? []).map((u) => ({
      id: u._id,
      username: u.username,
      firstname: u.firstname,
      lastname: u.lastname,
      vaccinations: (u.vaccinations ?? []).map((v) => ({
        id: v._id,
        name: v.name,
        description: v.description,
      })),
    }));

    setSuccessResponse(StatusCodes.OK, {
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
      },
      users,
      vaccinations: vaccinations.map((v) => ({
        id: v._id,
        name: v.name,
        description: v.description,
      })),
    }, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const addVaccinationForUser = async (req, res) => {
  try {
    const {eventId, userId} = req.params;
    const {vaccinationId} = req.body ?? {};

    if (!vaccinationId || typeof vaccinationId !== "string") {
      setErrorResponseMsg("vaccinationId is required", res,
          StatusCodes.BAD_REQUEST);
      return;
    }

    const event = await Event.findById(eventId)
    .select("title date location registeredUsers")
    .lean()
    .exec();

    if (!event) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    const isRegistered = (event.registeredUsers ?? []).some(
        (id) => String(id) === String(userId));
    if (!isRegistered) {
      setErrorResponseMsg("User is not registered for this event", res,
          StatusCodes.FORBIDDEN);
      return;
    }

    const vaccine = await Vaccination.findById(vaccinationId).select(
        "name description").lean().exec();
    if (!vaccine) {
      setErrorResponseMsg("Vaccination not found", res, StatusCodes.NOT_FOUND);
      return;
    }

    const updated = await userService.addVaccinationToUser(userId,
        vaccinationId);

    if (!updated) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    sendVaccinationMarkedEmail({
      event,
      user: updated,
      vaccination: vaccine,
    }).catch((e) => console.log("Vaccination marked email failed:", e));

    setSuccessResponse(StatusCodes.OK, {ok: true}, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
