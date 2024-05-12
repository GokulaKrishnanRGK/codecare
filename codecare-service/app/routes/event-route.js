import express from "express";
import * as eventController from '../controller/event-controller.js';
import {requireAuth, requireRole} from "../middleware/auth.js";
import {Roles} from "../entities/roles.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: (Number(process.env.MAX_UPLOAD_MB) || 10) * 1024 * 1024 },
});

router.route('/')
    .get(eventController.search)
    .post(requireAuth, requireRole([Roles.ADMIN]), upload.single("eventImage"), eventController.post);
router.route('/:id')
    .get(eventController.get)
    .put(requireAuth, requireRole([Roles.ADMIN]), upload.single("eventImage"), eventController.put)
    .delete(requireAuth, requireRole([Roles.ADMIN]), eventController.deleteEvent);

router.post(
    "/:id/register",
    requireAuth,
    requireRole([Roles.USER]),
    eventController.registerForEvent
);

router.post(
    "/:id/unregister",
    requireAuth,
    requireRole([Roles.USER]),
    eventController.unregisterForEvent
);


export default router;