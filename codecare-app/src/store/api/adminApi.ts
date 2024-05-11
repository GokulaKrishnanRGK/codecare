// store/api/adminApi.ts
import { baseApi } from "./baseApi";
import type { ApiResponse, Paginated } from "./apiTypes";
import type { User } from "../../models/auth/User";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Paginated<User>, { page: number }>({
      query: ({ page }) => ({ url: `/admin/users?page=${page}`, method: "GET" }),
      transformResponse: (resp: ApiResponse<Paginated<User>>) => resp.data,
      providesTags: (result) =>
          result
              ? [
                { type: "Users", id: "LIST" },
                ...result.items.map((u) => ({ type: "User" as const, id: u.id })),
              ]
              : [{ type: "Users", id: "LIST" }],
    }),

    updateUserRole: builder.mutation<User, { userId: string; role: "USER" | "ADMIN" }>({
      query: (body) => ({ url: `/admin/users/role`, method: "POST", body }),
      transformResponse: (resp: ApiResponse<User>) => resp.data,
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useUpdateUserRoleMutation } = adminApi;
