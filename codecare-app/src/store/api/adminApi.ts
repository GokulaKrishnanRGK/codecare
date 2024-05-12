import {baseApi} from "./baseApi";
import type {ApiResponse, DonationsAdminResponse, GetDonationsParams, Paginated} from "./apiTypes";
import type {User} from "../../models/auth/User";
import {Vaccination} from "../../models/vaccinations/Vaccination.ts";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Paginated<User>, { page: number }>({
      query: ({page}) => ({url: `/admin/users?page=${page}`, method: "GET"}),
      transformResponse: (resp: ApiResponse<Paginated<User>>) => resp.data,
      providesTags: (result) =>
          result
              ? [
                {type: "Users", id: "LIST"},
                ...result.items.map((u) => ({type: "User" as const, id: u.id})),
              ]
              : [{type: "Users", id: "LIST"}],
    }),

    updateUserRole: builder.mutation<User, {
      userId: string;
      role: "USER" | "ADMIN" | "VOLUNTEER"
    }>({
      query: (body) => ({url: `/admin/users/role`, method: "POST", body}),
      transformResponse: (resp: ApiResponse<User>) => resp.data,
      invalidatesTags: [{type: "Users", id: "LIST"}],
    }),
    getDonations: builder.query<DonationsAdminResponse, GetDonationsParams>({
      query: ({
                page,
                status = "ALL",
                sortBy = "paidAt",
                sortDir = "desc",
              }) => ({
        url: `/admin/donations`,
        method: "GET",
        params: {page, status, sortBy, sortDir},
      }),
      transformResponse: (resp: ApiResponse<DonationsAdminResponse>): DonationsAdminResponse => resp.data,
      providesTags: (result) =>
          result
              ? [
                {type: "Donations", id: "LIST"},
                ...result.items.map((d) => ({
                  type: "Donation" as const,
                  id: d.id,
                })),
              ]
              : [{type: "Donations", id: "LIST"}],
    }),
    getVaccinations: builder.query<Paginated<Vaccination>, { page: number }>({
      query: ({page}) => ({url: `/admin/vaccinations?page=${page}`, method: "GET"}),
      transformResponse: (resp: ApiResponse<Paginated<Vaccination>>) => resp.data,
      providesTags: (result) =>
          result
              ? [
                {type: "Vaccinations", id: "LIST"},
                ...result.items.map((v) => ({type: "Vaccination" as const, id: v.id})),
              ]
              : [{type: "Vaccinations", id: "LIST"}],
    }),

    createVaccination: builder.mutation<Vaccination, { name: string; description: string }>({
      query: (body) => ({url: `/admin/vaccinations`, method: "POST", body}),
      transformResponse: (resp: ApiResponse<Vaccination>) => resp.data,
      invalidatesTags: [{type: "Vaccinations", id: "LIST"}],
    }),
    updateVaccination: builder.mutation<Vaccination, {
      id: string;
      name: string;
      description: string
    }>({
      query: ({id, ...body}) => ({url: `/admin/vaccinations/${id}`, method: "PUT", body}),
      transformResponse: (resp: ApiResponse<Vaccination>) => resp.data,
      invalidatesTags: [{type: "Vaccinations", id: "LIST"}],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useGetDonationsQuery,
  useGetVaccinationsQuery,
  useCreateVaccinationMutation,
  useUpdateVaccinationMutation
} = adminApi;
