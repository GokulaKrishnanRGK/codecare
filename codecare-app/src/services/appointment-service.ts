import {deleteById, postForm, search, update} from './api-service';
import Appointment from '../models/Appointment.ts';
import {ResponseObject} from "../models/ResponseObject.ts";

const appointmentAPI = 'appointment-bookings';  // for users,doctors
const allAppointmentsAPI = 'appointment-bookings/admin'; //for admin 


export const searchAppointments = async (params = {}): Promise<ResponseObject<Appointment[]>> => {
    return await search<Appointment>(appointmentAPI, params);
}


export const searchAllAppointments = async (params = {}): Promise<ResponseObject<Appointment[]>> => {
    return await search<{ data: Appointment[] }>(allAppointmentsAPI, params);
}

export const createAppointment = async (appointment = {}): Promise<ResponseObject<Appointment>> => {
    return await postForm<Appointment>(appointmentAPI, appointment);
}

export const updateAppointment = async (appointment: Appointment) => {
    return await update(appointmentAPI, appointment);
}

export const deleteAppointment = async (id: string) => {
    return await deleteById(appointmentAPI, id);
}
