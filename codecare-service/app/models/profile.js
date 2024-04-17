import mongoose from "mongoose";
import schemaConfig from "./schema-config.js";


//vaccination Schema
const vaccinationSchema = new mongoose.Schema({
    id :String,
    vaccineName: {
        type: String,
        required: true
    },
    dateAdministered: {
        type: Date,
        required: true
    }
},schemaConfig);

const profileSchema = new mongoose.Schema({
    id: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    vaccinations: [vaccinationSchema],
}, schemaConfig);

const Profile = mongoose.model("profile",profileSchema);
export default Profile;