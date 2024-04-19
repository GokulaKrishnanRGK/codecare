import * as doctorService from '../services/doctor-service.js';
import { setSuccessResponse, setErrorCode } from '../utils/response-handler.js';
import { StatusCodes } from "http-status-codes";

/**
 * Search for doctors based on the provided query parameters
 * Fetches all the doctors if no parameter given
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
export const searchDoctors = async (request, response) => {
    try {
        const result = await doctorService.searchDoctors(request.query);
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Get a doctor by their ID
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
export const getDoctor = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await doctorService.getById(id);
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Delete a doctor by their ID
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
export const deleteDoctor = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await doctorService.deleteDoctorById(id);
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};

/**
 * Update a doctor by their ID
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
export const updateDoctor = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await doctorService.updateDoctorById(id, request.body);
        setSuccessResponse(StatusCodes.OK, result, response);
    } catch (error) {
        console.log(error);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
};
