import * as userService from "../services/user-service.js";
import {
  setErrorCode,
  setErrorResponseMsg,
  setSuccessResponse
} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      setErrorCode(StatusCodes.UNAUTHORIZED, res);
      return;
    }

    const me = await userService.getByIdWithVaccinations(userId);
    if (!me) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    const normalized = {
      id: me._id ?? me.id,
      username: me.username,
      firstname: me.firstname,
      lastname: me.lastname,
      role: me.role,
      vaccinations: (me.vaccinations ?? []).map((v) => ({
        id: v._id ?? v.id,
        name: v.name,
        description: v.description,
      })),
      emailSubscribed: Boolean(me.emailSubscribed),
    };

    setSuccessResponse(StatusCodes.OK, normalized, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateMyEmailSubscription = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      setErrorCode(StatusCodes.UNAUTHORIZED, res);
      return;
    }

    const {emailSubscribed} = req.body ?? {};
    if (typeof emailSubscribed !== "boolean") {
      setErrorResponseMsg("emailSubscribed must be boolean", res,
          StatusCodes.BAD_REQUEST);
      return;
    }

    const updated = await userService.updateEmailSubscription(userId,
        emailSubscribed);
    setSuccessResponse(StatusCodes.OK,
        {emailSubscribed: updated.emailSubscribed}, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
