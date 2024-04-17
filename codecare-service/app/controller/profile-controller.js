import { StatusCodes } from "http-status-codes";
import * as ProfileService from '../services/profile-service.js';
import { setErrorResponse, setSuccessResponse } from '../utils/response-handler.js';


export const save = async (req, res, next) => {
    try {
        
        const userData = { ...req.body, userId: req.user};  // Include userId from authenticated user
        const profile = await ProfileService.save(userData);
        setSuccessResponse(StatusCodes.CREATED, profile, res);

    } catch (error) {
        console.log(error);
        setErrorResponse(error, res);
    }
};

export const searchByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;  // Assuming userId is passed as a query parameter
        const profile = await ProfileService.searchByUserId(userId);
        setSuccessResponse(StatusCodes.OK, profile, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error, res);
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.userId;  // Assuming id in params is the ObjectId of the user's profile
        const updatedProfile = await ProfileService.update(id, req.body);
        setSuccessResponse(StatusCodes.OK, updatedProfile, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error.message, res, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const remove = async (req, res) => {
    try {
        const id = req.params.userId;  // Assuming id in params is the ObjectId of the user's profile
        await ProfileService.remove(id);
        setSuccessResponse(StatusCodes.NO_CONTENT, {}, res);
    } catch (error) {
        console.log(error);
        setErrorResponse(error.message, res, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const get = async (req, res) => {
    try {
        const profile = await ProfileService.get(req.params.userId);
        console.log(profile,req.params.userId)  // Assuming req.params.id is the ObjectId of the profile
        setSuccessResponse(StatusCodes.OK, profile, res);

    } catch (error) {
        console.log(error);
        setErrorResponse(error, res);
    }
};