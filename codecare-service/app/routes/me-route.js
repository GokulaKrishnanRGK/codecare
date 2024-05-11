import express from "express";
import {requireAuth} from "../middleware/auth.js";
import {setSuccessResponse} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  setSuccessResponse(StatusCodes.OK, req.user, res);
});

export default router;
