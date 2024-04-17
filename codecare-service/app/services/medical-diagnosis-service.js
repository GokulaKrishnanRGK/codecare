import mongoose from 'mongoose';
import MedicalDiagnosis from "../models/medical-diagnosis.js";

export const add = async (diagnosisData) => {
    const diagnosis = new MedicalDiagnosis(diagnosisData);
    return await diagnosis.save();
};

export const update = async (id, updateData) => {
    const objectId = new mongoose.Types.ObjectId(id);  // Ensure the ID is a valid ObjectId
    return await MedicalDiagnosis.findByIdAndUpdate(objectId, updateData, { new: true });
};

export const remove = async (userId) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await MedicalDiagnosis.findByIdAndDelete(objectId);
};

export const search = async (userId) => {

    const objectId = new mongoose.Types.ObjectId(userId);
    console.log(MedicalDiagnosis);
    const result = await MedicalDiagnosis.aggregate([
        { 
            $match: { user : objectId } 
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $lookup: {
                from: "users",  // Assuming the doctor is also stored in the 'users' collection
                localField: "doctor",
                foreignField: "_id",
                as: "doctorDetails"
            }
        },
        { $unwind: "$userDetails" },
        { $unwind: "$doctorDetails" },
        {
            $project: {
                _id: 0,
                diagnosis: 1,
                dateOfDiagnosis: 1,
                treatment: 1,
                user: {
                    id: "$userDetails._id",
                    username: "$userDetails.username",
                    name: { $concat: ["$userDetails.firstname", " ", "$userDetails.lastname"] }
                },
                doctor: {
                    id: "$doctorDetails._id",
                    username: "$doctorDetails.username",
                    name: { $concat: ["$doctorDetails.firstname", " ", "$doctorDetails.lastname"] }
                }
            }
        }
    ]).exec();

    if (result.length === 0) {
        throw new Error("Medical diagnosis not found.");
    }
    return result[0];
};

