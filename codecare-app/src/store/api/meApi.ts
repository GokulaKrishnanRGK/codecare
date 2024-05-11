import type { ApiResponse } from "./apiTypes";
import { baseApi } from "./baseApi";
import {User} from "../../models/auth/User.ts";

export const meApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => ({ url: "/me", method: "GET" }),
      transformResponse: (resp: ApiResponse<User>) => resp.data,
      providesTags: [{ type: "Auth", id: "ME" }],
    }),
  }),
});

export const { useMeQuery } = meApi;
