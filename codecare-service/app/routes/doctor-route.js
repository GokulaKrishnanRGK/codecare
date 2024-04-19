import express from "express";
import * as doctorController from '../controller/doctor-controller.js';
// import auth from "../middleware/auth.js";
// import {Roles} from "../entities/roles-enum.js";

const router = express.Router();

router.route('/')
    .get(doctorController.searchDoctors)
router.route('/:id')
    .get(doctorController.getDoctor)
    .put( doctorController.updateDoctor)
    .delete( doctorController.deleteDoctor);

export default router;