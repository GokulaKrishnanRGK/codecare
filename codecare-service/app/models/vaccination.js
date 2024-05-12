import mongoose from "mongoose";
import schemaConfig from "./schema-config.js";

const vaccinationSchema = new mongoose.Schema(
    {
      id: {type: String},
      name: {type: String, required: true, trim: true, maxlength: 120},
      description: {type: String, required: true, trim: true, maxlength: 2000},
    },
    schemaConfig
);

vaccinationSchema.index({name: 1}, {unique: true});

export default mongoose.model("vaccination", vaccinationSchema);
