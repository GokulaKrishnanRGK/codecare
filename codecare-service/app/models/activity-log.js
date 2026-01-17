import mongoose, {Schema} from "mongoose";
import schemaConfig from "./schema-config.js";

const activityLogSchema = new Schema({
  id: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ["POST", "PUT", "DELETE"]
  },
  status: {
    type: Number,
    required: true
  }
}, schemaConfig);

export default mongoose.model("activityLog", activityLogSchema);