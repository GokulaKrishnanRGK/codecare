import {setError, setResponse} from "../utils/response-handler.js";

export const getUser = async (req, res, next) => {
    setResponse({message:req.params.id}, res);
    next();
}
