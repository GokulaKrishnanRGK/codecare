import {StatusCodes} from "http-status-codes";
import {
  setErrorCode,
  setErrorResponseMsg,
  setSuccessResponse
} from "../utils/response-handler.js";
import * as userService from "../services/user-service.js";
import {Roles} from "../entities/roles.js";

const PAGE_SIZE = 10;

const parsePage = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.floor(n);
};

export const getUsers = async (req, res) => {
  try {
    const params = {};

    const page = parsePage(req.query.page);
    const skip = (page - 1) * PAGE_SIZE;

    const total = await userService.countUsers(params);
    const items = await userService.searchUsers(params, {
      skip,
      limit: PAGE_SIZE,
      sort: {createdAt: -1},
    });

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const usersResp = items.map((u) => ({
      id: u._id ?? u.id,
      clerkUserId: u.clerkUserId,
      username: u.username,
      firstname: u.firstname,
      lastname: u.lastname,
      role: u.role,
    }));

    setSuccessResponse(
        StatusCodes.OK,
        {items: usersResp, page, pageSize: PAGE_SIZE, total, totalPages},
        res
    );
  } catch (error) {
    console.log(error);
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, res);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const {userId, role} = req.body ?? {};

    if (!userId || typeof userId !== "string") {
      setErrorResponseMsg("userId is required", res);
      return;
    }

    if (!role || !Object.values(Roles).includes(role)) {
      setErrorResponseMsg("Invalid role", res);
      return;
    }

    const target = await userService.getById(userId);
    if (!target) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    if (target.role === Roles.ADMIN && role !== Roles.ADMIN) {
      setErrorResponseMsg("Cannot change an ADMIN role", res);
      return;
    }

    const updated = await userService.updateUserRoleById(userId, role);
    setSuccessResponse(StatusCodes.OK, updated, res);
  } catch (error) {
    console.log(error);
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, res);
  }
};
