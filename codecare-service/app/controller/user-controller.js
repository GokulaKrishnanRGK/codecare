import {setError, setResponse} from "../utils/response-handler.js";

export const getUser = async (req, res, next) => {
    const user = req.user; //username, role, firstname, lastname

    setResponse({message:req.params.id}, res);
    next();
}
