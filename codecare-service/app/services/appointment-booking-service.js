import { Specialization } from "../entities/specialization-enum.js";
import AppointmentBooking from "../models/appointment-booking.js";


export const searchAppointmentBookings = async (params = {}) => {
    try {
        const result = await AppointmentBooking.aggregate([
            {
                $match: params
            },
            {
                $unwind:'$feedback'
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'user'
                }
            },
            {
                $unwind:'$user'
            },
            {
                $lookup:{
                    from:'doctors',
                    localField:'doctorId',
                    foreignField:'_id',
                    as:'doctor'
                }
            },
            {
                $unwind:'$doctor'
            },
            {
                $project: {
                    appointmentId: '$_id',
                    userId: '$user._id',
                    username: '$user.username',
                    doctorId: '$doctor._id',
                    specialization: '$doctor.specialization',
                    appointmentDate: '$appointmentDate',
                    issue: '$issue',
                    medicalDiagnosis: '$feedback.medicalDiagnosis',
                    prescription: '$feedback.prescription',
                    status: '$status'
                }
            }
        ]).exec();
        return result;
    } catch (error) {
        throw error;
    }
};




export const getAppointmentBookingDetails = async (id) => {
    try {
        const appointmentBooking = await AppointmentBooking.findById(id).exec();
        return appointmentBooking;
    } catch (error) {
        throw error;
    }
};



export const createAppointmentBooking = async (appointmentBookingData) => {
    try {
        const appointmentBooking = new AppointmentBooking(appointmentBookingData);
        const savedAppointmentBooking = await appointmentBooking.save();
        return savedAppointmentBooking;
    } catch (error) {
        throw error;
    }
};



export const updateAppointmentBooking = async (appointmentBookingDetails) => {
    try {
        const appointmentBooking = new AppointmentBooking(appointmentBookingDetails);
        return appointmentBooking.save();
    } catch (error) {
        throw error;
    }
};




export const deleteAppointmentBooking = async (appointmentBookingId) => {
    try {
        const deletedAppointmentBooking = await AppointmentBooking.findByIdAndDelete(appointmentBookingId);
        return deletedAppointmentBooking;
    } catch (error) {
        throw error;
    }
};
