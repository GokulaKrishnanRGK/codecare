import {setErrorCode, setSuccessCode} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";
import Login from "../models/login.js";

export const logout = async (request, response, next) => {
    try {
        const user = request.user;
        user.tokens = user.tokens.filter((token) => { //token object
            return token.token != request.token;
        });
        await Login.updateOne({_id: user._id}, {$set: {tokens: user.tokens}});
        setSuccessCode(StatusCodes.OK, response);
    } catch (err) {
        console.log(err);
        setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
    }
}

export const test = async (request, response) => {
    setSuccessCode(StatusCodes.OK, response);
}