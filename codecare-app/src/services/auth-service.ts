import {postForm} from "./api-service.ts";
import {LoginDO} from "../models/LoginDO.ts";
import {ResponseObject} from "../models/ResponseObject.ts";

export const login = async (form: FormData): Promise<ResponseObject<LoginDO>> => {
    const data = {
        username: form.get('username'),
        password: form.get('password')
    };
    return await postForm<LoginDO>('public/login', data);
}

export const register = async (form: FormData): Promise<ResponseObject<any>> => {
    const data = {
        username: form.get('username'),
        password: form.get('password'),
        firstname: form.get('firstname'),
        lastname: form.get('lastname'),
    }
    return await postForm<LoginDO>('public/register', data);
}