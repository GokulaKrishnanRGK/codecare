import Donation from "../models/donation.js";

export const createDonation = async (donationData) => {
  return await new Donation(donationData).save();
}

export const searchDonations = async (params = {}, options = {}) => {
  const {skip = 0, limit, sort = {updatedAt: -1}} = options;

  return await Donation.find(params)
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .populate("user", "username firstname lastname")
  .lean()
  .exec();
};

export const countDonations = async (params = {}) => {
  return await Donation.countDocuments(params).exec();
};

export const sumDonationsAmount = async (params = {}) => {
  const result = await Donation.aggregate([
    {$match: params},
    {$group: {_id: null, totalAmount: {$sum: "$amount"}}},
  ]).exec();

  return result?.[0]?.totalAmount ?? 0;
};