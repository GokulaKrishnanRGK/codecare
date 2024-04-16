import {post} from "./api-service.ts";
import {LoginDO} from "../models/LoginDO.ts";

const loginApi = '/public/login';

export const login = async (data: FormData):  Promise<LoginDO> => {
    return await post(loginApi, data);
}