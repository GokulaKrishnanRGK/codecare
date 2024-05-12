import {StatusCodes} from "http-status-codes";
import {
  setErrorCode,
  setErrorResponseMsg,
  setSuccessResponse
} from "../utils/response-handler.js";
import * as userService from "../services/user-service.js";
import {Roles} from "../entities/roles.js";
import * as donationService from "../services/donation-service.js";
import * as vaccinationService from "../services/vaccination-service.js";
import {
  validateVaccinationRequest
} from "../validation/validateVaccinationPayload.js";
import {getPagination, calcTotalPages} from "../utils/pagination.js";

export const getUsers = async (req, res) => {
  try {
    const params = {};

    const {page, pageSize, skip, limit} = getPagination(req.query.page);

    const total = await userService.countUsers(params);
    const items = await userService.searchUsers(params, {
      skip,
      limit,
      sort: {createdAt: -1},
    });

    const totalPages = calcTotalPages(total, pageSize);

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
        {items: usersResp, page, pageSize, total, totalPages},
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

export const getDonations = async (req, res) => {
  try {
    const {page, pageSize, skip, limit} = getPagination(req.query.page);

    const status = String(req.query.status ?? "ALL");
    const sortBy = String(req.query.sortBy ?? "paidAt");
    const sortDir = String(req.query.sortDir ?? "desc");

    const filter = {};
    if (status !== "ALL") {
      filter.status = status;
    }

    const dir = sortDir === "asc" ? 1 : -1;
    const sort = sortBy === "amount" ? {amount: dir} : {paidAt: dir};

    const [total, items, agg] = await Promise.all([
      donationService.countDonations(filter),
      donationService.searchDonations(filter, {skip, limit, sort}),
      donationService.sumDonationsAmount(filter),
    ]);

    const totalPages = calcTotalPages(total, pageSize);
    const totalAmount = agg ?? 0;

    const normalized = items.map((d) => {
      const u = d.user;
      const hasUser = u && typeof u === "object";
      return {
        id: d._id,
        amount: d.amount,
        currency: d.currency,
        status: d.status,
        paidAt: d.paidAt ?? d.updatedAt ?? d.createdAt,
        user: hasUser
            ? {
              username: u.username,
              firstname: u.firstname,
              lastname: u.lastname
            }
            : {username: null, firstname: "Anonymous", lastname: ""},
      };
    });

    setSuccessResponse(
        StatusCodes.OK,
        {items: normalized, page, pageSize, total, totalPages, totalAmount},
        res
    );
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getVaccinations = async (req, res) => {
  try {
    const {page, pageSize, skip, limit} = getPagination(req.query.page);

    const total = await vaccinationService.countVaccinations({});
    const items = await vaccinationService.listVaccinations({}, {
      sort: {name: 1},
      skip,
      limit,
    });

    const totalPages = calcTotalPages(total, pageSize);

    const normalized = items.map((v) => ({
      id: v._id ?? v.id,
      name: v.name,
      description: v.description,
    }));

    setSuccessResponse(
        StatusCodes.OK,
        {items: normalized, page, pageSize, total, totalPages},
        res
    );
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const createVaccination = async (req, res) => {
  try {
    const v = validateVaccinationRequest({req, res, mode: "create"});
    if (!v.ok) {
      return;
    }

    const created = await vaccinationService.createVaccination(v.data);

    setSuccessResponse(
        StatusCodes.OK,
        {id: created._id, name: created.name, description: created.description},
        res
    );
  } catch (err) {
    if (err?.code === 11000) {
      setErrorResponseMsg("Vaccination name already exists", res,
          StatusCodes.CONFLICT);
      return;
    }
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateVaccination = async (req, res) => {
  try {
    const {id} = req.params;

    const v = validateVaccinationRequest({req, res, mode: "update"});
    if (!v.ok) {
      return;
    }

    const updated = await vaccinationService.updateVaccinationById(id, v.data);
    if (!updated) {
      setErrorCode(StatusCodes.NOT_FOUND, res);
      return;
    }

    setSuccessResponse(
        StatusCodes.OK,
        {id: updated._id, name: updated.name, description: updated.description},
        res
    );
  } catch (err) {
    if (err?.code === 11000) {
      setErrorResponseMsg("Vaccination name already exists", res,
          StatusCodes.CONFLICT);
      return;
    }
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
