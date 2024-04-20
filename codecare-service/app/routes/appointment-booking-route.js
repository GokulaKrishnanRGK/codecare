import express from "express";
import * as appointmentBookingController from '../controller/appointment-booking-controller.js';
import auth from "../middleware/auth.js";
import {Roles} from "../entities/roles-enum.js";

const router = express.Router();

router.route('/')
    .get(auth([Roles.ADMIN]),appointmentBookingController.search)
    .post( appointmentBookingController.createAppointmentBooking);

router.route('/:userId')
    .get(auth([Roles.USER]),appointmentBookingController.searchByUserId);

router.route('/:doctorId')
    .get(auth([Roles.DOCTOR]),appointmentBookingController.searchByDoctorId);

router.route('/:id')
    
    .put(auth([Roles.DOCTOR,Roles.USER])appointmentBookingController.updateById)
    .delete( auth([Roles.ADMIN]),appointmentBookingController.deleteById);

export default router;
