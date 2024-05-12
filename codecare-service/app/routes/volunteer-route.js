import express from "express";
import {requireAuth, requireRole} from "../middleware/auth.js";
import {Roles} from "../entities/roles.js";
import * as volunteerController from "../controller/volunteer-controller.js";

const router = express.Router();

router.get(
    "/events/:eventId/registrations",
    requireAuth,
    requireRole([Roles.VOLUNTEER]),
    volunteerController.getEventRegistrations
);

router.post(
    "/events/:eventId/users/:userId/vaccinations",
    requireAuth,
    requireRole([Roles.VOLUNTEER]),
    volunteerController.addVaccinationForUser
);

export default router;
