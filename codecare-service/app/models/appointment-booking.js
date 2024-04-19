import mongoose,{Schema} from "mongoose";
import schemaConfig from "./schema-config.js";
import { Status } from "../entities/status-enum.js";

// Define the Feedback schema
const feedbackSchema = new mongoose.Schema({
    id:String,
    medicalDiagnosis: {
        type: String
    },
    prescription: {
        type: String
    }
}, schemaConfig);

// Custom validation function for date format MM/DD/YYYY
function isValidDate(date) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

// Define the appointmentBooking schema
const appointmentBookingSchema = new mongoose.Schema({
    id: String,
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    appointmentDate: {
        type: String,
        required: true,
        validate: {
            validator: isValidDate,
            message: "Invalid date format. Use MM/DD/YYYY format."
        }
    },
    issue: {
        type: String,
        required: true
    },
    feedback: [feedbackSchema],
    status: {
        type: String,
        enum: [Status.BOOKED, Status.CANCELLED,Status.COMPLETE],
        default: Status.BOOKED
    }

}, schemaConfig);



const AppointmentBooking= mongoose.model('appointmentBooking', appointmentBookingSchema);
export default AppointmentBooking;