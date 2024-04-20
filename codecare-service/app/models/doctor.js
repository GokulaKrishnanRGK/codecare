import mongoose,{Schema} from "mongoose";
import schemaConfig from "./schema-config.js";
import { Specialization } from "../entities/specialization-enum.js";

const doctorSchema = new mongoose.Schema({
    id: String,
    user: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    specialization: {
        type: String,
        enum:Object.values(Specialization),
        required: true,
    }
}, schemaConfig);

const Doctor = mongoose.model('doctor', doctorSchema);
export default Doctor;

