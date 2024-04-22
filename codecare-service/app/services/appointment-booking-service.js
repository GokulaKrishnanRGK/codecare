import AppointmentBooking from "../models/appointment-booking.js";

export const searchAppointmentBookings = async (params = {}) => {
    try {
        const result = await AppointmentBooking.aggregate([
            {
                $match: params
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctor",
                    foreignField: "user",
                    as: "doctor",
                },
            },
            {
                $unwind: "$doctor",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "doctor.user",
                    foreignField: "_id",
                    as: "doctor.user",
                },
            },
            {
                $unwind: "$doctor.user",
            },
            {
                $project: {
                    id: "$_id",
                    user: {
                        id: "$user._id",
                        username: "$user.username",
                        firstname: "$user.firstname",
                        lastname: "$user.lastname",
                    },
                    doctor: {
                        id: "$doctor.user._id",
                        firstname: "$doctor.user.firstname",
                        lastname: "$doctor.user.lastname",
                        specialization: "$doctor.specialization",
                        roomNo: "$doctor.roomNo",
                        address: {
                            hospitalName:
                                "$doctor.address.hospitalName",
                            city: "$doctor.address.city",
                        },
                    },
                    appointmentDate: "$appointmentDate",
                    appointmentStartTime:
                        "$appointmentStartTime",
                    appointmentEndTime: "$appointmentEndTime",
                    issue: "$issue",
                    medicalDiagnosis:
                        "$feedback.medicalDiagnosis",
                    prescription: "$feedback.prescription",
                    status: "$status",
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
