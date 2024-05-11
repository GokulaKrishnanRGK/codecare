import {StatusCodes} from "http-status-codes";
import {getAuth, clerkClient} from "@clerk/express";
import {setErrorCode} from "../utils/response-handler.js";
import {Roles} from "../entities/roles.js";
import * as userService from "../services/user-service.js";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      setErrorCode(StatusCodes.UNAUTHORIZED, res);
      return;
    }

    const clerkUserId = auth.userId;

    let user = await userService.findByClerkUserId(clerkUserId);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const email = clerkUser?.primaryEmailAddress?.emailAddress;

      user = await userService.createUser({
        clerkUserId,
        username: email ?? clerkUserId,
        firstname: clerkUser.firstName ?? "",
        lastname: clerkUser.lastName ?? "",
        role: Roles.USER,
      });
    }

    req.auth = auth;
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    setErrorCode(StatusCodes.UNAUTHORIZED, res);
  }
};

export const requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    setErrorCode(StatusCodes.UNAUTHORIZED, res);
    return;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
    setErrorCode(StatusCodes.FORBIDDEN, res);
    return;
  }
  next();
};
