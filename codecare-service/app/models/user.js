import mongoose from "mongoose";
import schemaConfig from "./schema-config.js";
import {Roles} from "../entities/roles.js";

const userSchema = new mongoose.Schema(
    {
      clerkUserId: {type: String, required: true, unique: true, index: true},

      username: {type: String, required: true, unique: true, index: true},
      firstname: {type: String, required: true, default: ""},
      lastname: {type: String, required: true, default: ""},

      role: {
        type: String,
        enum: Object.values(Roles),
        required: true,
        default: Roles.USER,
        index: true,
      },
    },
    schemaConfig
);

export default mongoose.model("user", userSchema);
