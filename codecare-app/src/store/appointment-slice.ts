import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Appointment from "../models/appointments/Appointment.ts";
import { AppState } from ".";


export type appointmentState = Appointment[];
const initiateState: appointmentState = [];
export const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: initiateState,
    reducers: {
        loadAppointments: (_state: appointmentState, action: PayloadAction<appointmentState>) => {
            return [...action.payload];
        }
    }
});

export const { loadAppointments} = appointmentSlice.actions;

export const getAll = (): ((state:AppState) => appointmentState) => {
    return (state: AppState) => state.appointments;
}

export default appointmentSlice.reducer;