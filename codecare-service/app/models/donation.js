import mongoose from "mongoose";
import schemaConfig from "./schema-config.js";

const donationSchema = new mongoose.Schema(
    {
      user: {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId,
        required: false
      },

      amount: {type: Number, required: true},
      currency: {type: String, required: true, default: "usd"},

      stripeCheckoutSessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
      },
      stripePaymentIntentId: {type: String, required: false, index: true},

      status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "CANCELED"],
        required: true,
        default: "PENDING",
        index: true,
      },

      paidAt: {type: Date, required: false},
    },
    schemaConfig
);

export default mongoose.model("donation", donationSchema);
