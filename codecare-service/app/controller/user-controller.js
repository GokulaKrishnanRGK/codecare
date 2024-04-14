import {setSuccessResponse} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";

export const getUser = async (req, res, next) => {
    const user = req.user; //username, role, firstname, lastname
    setSuccessResponse(StatusCodes.OK, {user: user}, res);
}
