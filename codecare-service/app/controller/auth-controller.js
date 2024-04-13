import {setError, setResponse} from "../utils/response-handler.js";
import {findByCredentials} from "../services/auth-service.js";

export const login = async (request, response) => {
    try {
        const {username, password} = {...request.body};
        const user = await findByCredentials(username, password);
        const token=user.generateAuthToken();
        setResponse({user,token}, response);
    } catch (error) {
        setError(error);
    }
}

export const register = async (request, response) => {
    try {
        const {username, password, firstname, lastname} = {...request.body};
        const user = {username:username, firstname:firstname, lastname:lastname};


    } catch (error) {
        setError(error);
    }
}