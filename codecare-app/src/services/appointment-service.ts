import { deleteById, postForm, search, update } from './api-service';
import Appointment from '../models/Appointment.ts';

const appointmentAPI = 'appointment-bookings';  // for users,doctors
const allAppointmentsAPI = 'appointment-bookings/admin'; //for admin 


export const searchAppointments = async (params = {}): Promise<Array<Appointment>> => {
    const appointmentArr = await search<{ data: Appointment[] }>(appointmentAPI, params);
    return appointmentArr.data;
}


export const searchAllAppointments = async (params = {}): Promise<Array<Appointment>> => {
    const appointmentArr = await search<{ data: Appointment[] }>(allAppointmentsAPI, params);
    return appointmentArr.data;
}


export const createAppointment = async (appointment = {}) => {
    return await postForm(appointmentAPI, appointment);
}

export const updateAppointment = async (appointment: Appointment) => {
    return await update(appointmentAPI, appointment);
}

export const deleteAppointment = async (id: string) => {
    return await deleteById(appointmentAPI, id);
}
