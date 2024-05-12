import axios from "./axios-config";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";
import type {ResponseObject} from "../models/ResponseObject";

const parseSuccess = <T>(response: AxiosResponse<T>): ResponseObject<T> => ({
  status: response.status,
  data: response.data,
});

const parseError = (error: AxiosError): ResponseObject<never> => ({
  status: error.response?.status ?? 500,
  error: {
    message:
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "Request failed",
    data: error.response?.data,
  },
});

export const search = async <T>(
    path: string,
    params: Record<string, string | number | boolean | undefined> = {}
): Promise<ResponseObject<T[]>> => {
  try {
    const response = await axios.get<T[]>(`/${path}`, {params});
    return parseSuccess(response);
  } catch (err) {
    if (isAxiosError(err)) {
      return parseError(err);
    }
    throw err;
  }
};

export const getById = async <T>(
    path: string,
    id: string
): Promise<ResponseObject<T>> => {
  try {
    const response = await axios.get<T>(`/${path}/${id}`);
    return parseSuccess(response);
  } catch (err) {
    if (isAxiosError(err)) {
      return parseError(err);
    }
    throw err;
  }
};

export const post = async <TResponse, TBody extends object>(
    path: string,
    body: TBody
): Promise<ResponseObject<TResponse>> => {
  try {
    const response = await axios.post<TResponse>(`/${path}`, body);
    return parseSuccess(response);
  } catch (err) {
    if (isAxiosError(err)) {
      return parseError(err);
    }
    throw err;
  }
};

export const put = async <TResponse, TBody extends { id: string }>(
    path: string,
    body: TBody
): Promise<ResponseObject<TResponse>> => {
  try {
    const response = await axios.put<TResponse>(`/${path}/${body.id}`, body);
    return parseSuccess(response);
  } catch (err) {
    if (isAxiosError(err)) {
      return parseError(err);
    }
    throw err;
  }
};

export const deleteById = async (
    path: string,
    id: string
): Promise<ResponseObject<void>> => {
  try {
    const response = await axios.delete<void>(`/${path}/${id}`);
    return parseSuccess(response);
  } catch (err) {
    if (isAxiosError(err)) {
      return parseError(err);
    }
    throw err;
  }
};
