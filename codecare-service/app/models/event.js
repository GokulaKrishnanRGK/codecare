import mongoose from 'mongoose';
import schemaConfig from "./schema-config.js";

const locationSchema = new mongoose.Schema({
  id: String,
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
  name: {type: String, required: true},
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
  contactInfo: {
    type: String,
    required: true
  },
  eventImage: String,
  location: locationSchema
}, schemaConfig);

const Event = mongoose.model('event', eventSchema);

export default Event;