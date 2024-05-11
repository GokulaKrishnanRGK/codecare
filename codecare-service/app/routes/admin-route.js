import express from "express"
import * as adminController from "../controller/admin-controller.js";
import {requireAuth, requireRole} from "../middleware/auth.js";
import {Roles} from "../entities/roles.js";

const router = express.Router();

router.route('/users')
    .get(requireAuth, requireRole([
        Roles.ADMIN]), adminController.getUsers);

router.route('/users/role')
    .post(requireAuth, requireRole([Roles.ADMIN]), adminController.updateUserRole);

export default router;