import {calcTotalPages, getPagination} from "../utils/pagination.js";
import {
  setErrorResponseMsg,
  setSuccessResponse
} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";
import * as activityLogService from "../services/activity-log-service.js";

export const getActivities = async (req, res) => {
  try {
    const {page, pageSize, skip, limit} = getPagination(req.query.page);
    const total = await activityLogService.countActivities();
    const activities = await activityLogService.search({},
        {skip, limit, sort: {createdAt: -1}});
    const totalPages = calcTotalPages(total, pageSize);
    setSuccessResponse(StatusCodes.OK,
        {items: activities, page, pageSize, total, totalPages}, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
