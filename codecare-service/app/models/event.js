import mongoose from 'mongoose';
import schemaConfig from "./schema-config.js";

const locationSchema = new mongoose.Schema({
  id: String,
  address: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  country: {type: String, required: true},
  postalCode: {type: String, required: true}
}, schemaConfig);

const eventSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    maxlength: 250,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true
  },
  eventImage: {
    type: String,
    required: true
  },
  location: locationSchema,
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: []
  }],
  attendedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: []
  }],
}, schemaConfig);

const Event = mongoose.model('event', eventSchema);

export default Event;