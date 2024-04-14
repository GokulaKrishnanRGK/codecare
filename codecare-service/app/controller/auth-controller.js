import {setErrorResponse, setSuccessResponse} from "../utils/response-handler.js";
import {findByCredentials} from "../services/auth-service.js";
import * as userService from "../services/user-service.js";
import * as roleService from "../services/role-service.js";
import * as authService from "../services/auth-service.js";
import { StatusCodes} from "http-status-codes";

export const login = async (request, response) => {
    try {
        const {username, password} = {...request.body};
        const user = await findByCredentials(username, password);
        const token = user.generateAuthToken(process.env.JWT_KEY);
        setSuccessResponse(StatusCodes.OK, {user: user, token: token}, response);
    } catch (error) {
        console.log(error);
        setErrorResponse(error, response);
    }
}

export const register = async (request, response) => {
    try {
        const {username, password, firstname, lastname} = {...request.body};
        const user = await userService.save({username: username, firstname: firstname, lastname: lastname});
        const role = await roleService.findRoleByName("ADMIN");
        const login = await authService.save({username: username, password: password, user: user._id, role: role._id});
        setSuccessResponse(StatusCodes.OK, login, response);
    } catch (error) {
        console.log(error);
        setErrorResponse(error, response);
    }
}