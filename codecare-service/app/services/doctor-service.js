import Doctor from './../models/doctor.js';


export const searchDoctors = async (params = {}) => {
    try {
        const result = await Doctor.find(params).exec();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getById = async (id) => {
    return await Doctor.findById(id).exec();
}

export const createDoctor = async (doctorData) => {
    try {
        const doctor = new Doctor(doctorData);
        const savedDoctor = await doctor.save();
        return savedDoctor;
    } catch (error) {
        throw error;
    }
}

export const updateDoctorById = async (id, doctorData) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorData, { new: true }).exec();
        return updatedDoctor;
    } catch (error) {
        throw error;
    }
}

export const deleteDoctorById = async (id) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id).exec();
        return deletedDoctor;
    } catch (error) {
        throw error;
    }
}
