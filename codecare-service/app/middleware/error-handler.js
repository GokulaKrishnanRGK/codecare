import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { setErrorResponseMsg } from "../utils/response-handler.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return setErrorResponseMsg("File too large. Max upload size is 10MB.", res, StatusCodes.PAYLOAD_TOO_LARGE);
    }
    return setErrorResponseMsg(err.message, res, StatusCodes.BAD_REQUEST);
  }
  if (err) {
    console.error(err);
    return setErrorResponseMsg("Something went wrong", res, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return next();
}
