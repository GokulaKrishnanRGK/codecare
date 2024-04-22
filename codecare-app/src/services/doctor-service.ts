import {ResponseObject} from "../models/ResponseObject.ts";
import Doctor from "../models/Doctor.ts";
import {getById, postForm, search} from "./api-service.ts";
import {Specialization} from "../models/Specialization.ts";

export const fetchDoctorDetails = async (id: string): Promise<ResponseObject<Doctor>> => {
    return await getById<Doctor>('doctor', id);
}

export const createOrUpdateDoctor = async(data: Doctor): Promise<ResponseObject<Doctor>> => {
    return await postForm<Doctor>('doctor', data);
}

export const getSpecializations = async (params: {}): Promise<ResponseObject<Specialization[]>> => {
    return await search<Specialization>('doctor/getSpecializations', params);
}