import express from "express";
import {requireAuth} from "../middleware/auth.js";
import {setSuccessResponse} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";
import * as meController from "../controller/me-controller.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  setSuccessResponse(StatusCodes.OK, req.user, res);
});

router.get("/profile", requireAuth, meController.getMyProfile);

router.post("/subscription", requireAuth, meController.updateMyEmailSubscription);

export default router;
