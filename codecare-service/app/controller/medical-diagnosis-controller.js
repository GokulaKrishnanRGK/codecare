import { StatusCodes } from "http-status-codes";
import * as MedicalDiagnosisService from '../services/medical-diagnosis-service.js';
import { setErrorResponse, setSuccessResponse } from '../utils/response-handler.js';

export const add = async (req, res) => {
    try {
        const diagnosisData = { ...req.body, userId: req.user };  // Include user from authenticated user
        const diagnosis = await MedicalDiagnosisService.add(diagnosisData);
        setSuccessResponse(StatusCodes.CREATED,diagnosis, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error, res);
    }
};

export const get = async (req, res) => {
    try {

        const id = req.params.id;  // Ensure operation is specific to authenticated user
        console.log(id);
        const diagnosis = await MedicalDiagnosisService.search(id);
        setSuccessResponse( StatusCodes.OK,diagnosis, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error.message, res, StatusCodes.NOT_FOUND);
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params;
        const update = req.body;
        const diagnosis = await MedicalDiagnosisService.update(id, update);
        setSuccessResponse(StatusCodes.OK,diagnosis, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error, res);
    }
};

export const remove = async (req, res) => {
    try {
        const id = req.params;
        await MedicalDiagnosisService.remove(id);
        setSuccessResponse(StatusCodes.NO_CONTENT,{}, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error, res);
    }
};
