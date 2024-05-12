import {baseApi} from "./baseApi";
import type {ApiResponse} from "./apiTypes";
import type {DonationStats} from "../../models/donations/DonationStats";

export const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDonationStats: builder.query<DonationStats, void>({
      query: () => ({url: `/donations/stats`, method: "GET"}),
      transformResponse: (resp: ApiResponse<DonationStats>) => resp.data,
      providesTags: [{type: "Donations", id: "STATS"}],
    }),
  }),
  overrideExisting: false,
});

export const {useGetDonationStatsQuery} = donationApi;
