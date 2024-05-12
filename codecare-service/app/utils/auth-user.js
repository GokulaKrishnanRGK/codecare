import {getAuth} from "@clerk/express";
import * as userService from "../services/user-service.js";

export const getCurrentUserFromClerk = async (req) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return null;
  }
  return await userService.findByClerkUserId(auth.userId);
};
