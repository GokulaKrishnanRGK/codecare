import Doctor from './../models/doctor.js';

const doctorSearchPipeline = (params = {}) => {
  return [
    {
      $match: params
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        id: "$_id",
        user: "$user._id",
        specialization: "$specialization",
        roomNo: "$roomNo",
        firstname: "$user.firstname",
        lastname: "$user.lastname",
        address: {
          hospitalName: "$address.hospitalName",
          city: "$address.city"
        }
      }
    }
  ]
}

export const search = async (params = {}) => {
  try {
    return await Doctor.aggregate(doctorSearchPipeline(params)).exec();
  } catch (error) {
    throw error;
  }
};

export const searchOne = async (params = {}) => {
  try {
    return await Doctor.findOne(params).exec();
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
    return await doctor.save();
  } catch (error) {
    throw error;
  }
}

export const updateDoctorById = async (id, doctorData) => {
  try {
    return await Doctor.findByIdAndUpdate(id, doctorData,
        {new: true}).exec();
  } catch (error) {
    throw error;
  }
}

export const deleteDoctorById = async (id) => {
  try {
    return await Doctor.findByIdAndDelete(id).exec();
  } catch (error) {
    throw error;
  }
}
