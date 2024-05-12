import type {ApiResponse} from "./apiTypes";
import {baseApi} from "./baseApi";
import {User} from "../../models/auth/User.ts";
import {MyProfile} from "../../models/profile/MyProfile.ts";

export const meApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => ({url: "/me", method: "GET"}),
      transformResponse: (resp: ApiResponse<User>) => resp.data,
      providesTags: [{type: "Auth", id: "ME"}],
    }),
    getMyProfile: builder.query<MyProfile, void>({
      query: () => ({url: `/me/profile`, method: "GET"}),
      transformResponse: (resp: ApiResponse<MyProfile>) => resp.data,
      providesTags: [{type: "Me", id: "PROFILE"}],
    }),
    updateMyEmailSubscription: builder.mutation<{ emailSubscribed: boolean }, {
      emailSubscribed: boolean
    }>({
      query: (body) => ({url: `/me/subscription`, method: "POST", body}),
      transformResponse: (resp: ApiResponse<{ emailSubscribed: boolean }>) => resp.data,
      invalidatesTags: [{type: "Me", id: "PROFILE"}],
    }),
  }),
});

export const {useMeQuery, useGetMyProfileQuery, useUpdateMyEmailSubscriptionMutation} = meApi;
