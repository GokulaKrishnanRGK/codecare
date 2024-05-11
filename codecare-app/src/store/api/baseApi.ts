import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: [
    "Events",
    "Event",
    "Users",
    "User",
    "Auth",
  ],
  endpoints: () => ({}),
});
