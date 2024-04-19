import * as appointmentBookingService from '../services/appointment-booking-service.js';
import { setSuccessResponse, setErrorCode } from '../utils/response-handler.js';
import { StatusCodes } from "http-status-codes";
import  mongoose  from 'mongoose';




/**
 * Create an appointment booking
 * @param request
 * @param response
 * @returns {Promise<void>}
 */


export const createAppointmentBooking = async (request, response) => {
    try {
        const appointmentBookingData = request.body;
        const result = await appointmentBookingService.createAppointmentBooking(appointmentBookingData);
        setSuccessResponse(StatusCodes.CREATED, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};



/**
 * Search for appointment bookings based on the provided query parameters
 * Fetches all the appointment bookings if no parameter given
 * @param request
 * @param response
 * @returns {Promise<void>}
 */


export const search = async (request, response) => {
    try {
        const result = await appointmentBookingService.searchAppointmentBookings(request.query);
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Search for appointment bookings based on the provided userId
 * @param request
 * @param response
 * @returns {Promise<void>}
 */


export const searchByUserId = async (request, response) => {
    try {
        const { userId } = request.params;
        const result = await appointmentBookingService.searchAppointmentBookings({ userId:userId});
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Search for appointment bookings based on the provided doctorId
 * @param request
 * @param response
 * @returns {Promise<void>}
 */


export const searchByDoctorId = async (request, response) => {
    try {
        const { doctorId } = request.params;
        const result = await appointmentBookingService.searchAppointmentBookings({ doctorId:doctorId });
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Delete an appointment booking by its ID
 * @param request
 * @param response
 * @returns {Promise<void>}
 */


export const deleteById = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await appointmentBookingService.deleteAppointmentBooking(id);
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Update an appointment booking by its ID
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
export const updateById = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await appointmentBookingService.updateAppointmentBooking({ ...request.body, id });
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

