import express from "express";
import * as appointmentBookingController from '../controller/appointment-booking-controller.js';
// import auth from "../middleware/auth.js";
// import {Roles} from "../entities/roles-enum.js";

const router = express.Router();

router.route('/')
    .get(appointmentBookingController.search)
    .post( appointmentBookingController.createAppointmentBooking);

router.route('/:userId')
    .get(appointmentBookingController.searchByUserId);

router.route('/:doctorId')
    .get(appointmentBookingController.searchByDoctorId);

router.route('/:id')
    
    .put( appointmentBookingController.updateById)
    .delete( appointmentBookingController.deleteById);

export default router;