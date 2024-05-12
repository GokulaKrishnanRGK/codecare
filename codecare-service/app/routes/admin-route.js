import express from "express"
import * as adminController from "../controller/admin-controller.js";
import {requireAuth, requireRole} from "../middleware/auth.js";
import {Roles} from "../entities/roles.js";
import {updateVaccination} from "../controller/admin-controller.js";

const router = express.Router();

router.route('/users')
.get(requireAuth, requireRole([
  Roles.ADMIN]), adminController.getUsers);

router.route('/users/role')
.post(requireAuth, requireRole([Roles.ADMIN]), adminController.updateUserRole);

router.route("/donations")
.get(requireAuth, requireRole([Roles.ADMIN]), adminController.getDonations);

router.route("/vaccinations")
.get(requireAuth, requireRole([Roles.ADMIN]), adminController.getVaccinations)
.post(requireAuth, requireRole([Roles.ADMIN]),
    adminController.createVaccination);

router.put("/vaccinations/:id", requireAuth, requireRole(Roles.ADMIN), updateVaccination);

export default router;