import Vaccination from "../models/vaccination.js";

export const createVaccination = async (data) => {
  return Vaccination.create(data);
};

export const listVaccinations = async (params = {}, options = {}) => {
  const {sort = {name: 1}, skip = 0, limit = 10} = options;

  return Vaccination.find(params)
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .lean()
  .exec();
};

export const getVaccinationById = async (id) => {
  return Vaccination.findById(id).lean().exec();
};

export const countVaccinations = async (params = {}) => {
  return Vaccination.countDocuments(params).exec();
};

export const deleteVaccinationById = async (id) => {
  return Vaccination.findByIdAndDelete(id).lean().exec();
};

export const updateVaccinationById = async (id, patch) => {
  return await Vaccination.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true, runValidators: true }
  ).exec();
};