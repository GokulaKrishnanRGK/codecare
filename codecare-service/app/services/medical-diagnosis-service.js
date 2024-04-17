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
    const objectId = new mongoose.Types.ObjectId(userId);  // Convert string to ObjectId

    const result = await MedicalDiagnosis.aggregate([
        {
            $match: { user: objectId }  // Match the diagnosis to the user
        },
        {
            $lookup: {
                from: "users",  // Assume 'users' collection holds user data
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"  // Flatten the array to merge user details
        },
        {
            $project: {
                _id: 1,  // Include diagnosis fields
                diagnosis: 1,
                dateOfDiagnosis: 1,
                treatment: 1,
                user: {  // Project the user details
                    _id: "$user._id",
                    username: "$user.username",
                    fullname: { $concat: ["$user.firstname", " ", "$user.lastname"] }
                }
            }
        }
    ]).exec();  
    
    return result[0] || null;  // Return the first result or null if no entries

};

// export const search = async (userId) => {

//     const objectId = new mongoose.Types.ObjectId(userId);
//     // Using populate to join 'user' and 'doctor' fields with corresponding data from the 'users' collection
//     const diagnosis = await MedicalDiagnosis.findOne({ user: objectId })
//         .populate('user', 'username firstname lastname')  // Selectively populate fields
//         .populate('doctor', 'username firstname lastname'); // Selectively populate fields

// };

