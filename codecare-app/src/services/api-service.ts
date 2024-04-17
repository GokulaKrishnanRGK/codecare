import axios from "./axios-config.ts";
import {ResponseObject} from "../models/ResponseObject.ts";
import {AxiosResponse} from "axios";

const parseResponse = <T>(response: AxiosResponse<T>) => {
    const data: any = response.data;
    const responseObject: ResponseObject<T> = {status: response.status, ...data};
    return responseObject;
}

export const search = async <T>(path: string, params: any = {}): Promise<ResponseObject<T[]>> => {
    const query: URLSearchParams = new URLSearchParams(params);
    const response = await axios.get(`/${path}?${query}`);
    return parseResponse(response);
};

export const getById = async <T>(path: string, id: string): Promise<ResponseObject<T>> => {
    const response = await axios.get(`/${path}/${id}`);
    return parseResponse(response);
};

export const postForm = async <T>(path: string, object: any): Promise<ResponseObject<T>> => {
    const response = await axios.post(`/${path}`, object, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return parseResponse(response);
};

export const save = async <T>(path: string, object: T): Promise<ResponseObject<any>> => {
    const response = await axios.post(`/${path}`, JSON.stringify(object), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return parseResponse(response);
};

export const update = async <T>(path: string, object: T): Promise<ResponseObject<any>> => {
    const response = await axios.put(`/${path}/${object.id}`, JSON.stringify(object), {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return parseResponse(response);
};

export const deleteById = async (path: string, id: string): Promise<ResponseObject<any>> => {
    const response = await axios.delete(`/${path}/${id}`);
    return parseResponse(response);
};
