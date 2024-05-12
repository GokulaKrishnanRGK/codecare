import { baseApi } from "./baseApi";
import type { ApiResponse } from "./apiTypes";

export interface VaccinationDto {
  id: string;
  name: string;
  description: string;
}

export interface RegisteredUserDto {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  vaccinations: VaccinationDto[];
}

export interface EventRegistrationsResponse {
  event: { id: string; title: string; date: string };
  users: RegisteredUserDto[];
  vaccinations: VaccinationDto[];
}

export const volunteerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEventRegistrations: builder.query<EventRegistrationsResponse, { eventId: string }>({
      query: ({ eventId }) => ({
        url: `/volunteer/events/${eventId}/registrations`,
        method: "GET",
      }),
      transformResponse: (resp: ApiResponse<EventRegistrationsResponse>) => resp.data,
      providesTags: (_r, _e, arg) => [{ type: "VolunteerEvent", id: arg.eventId }],
    }),

    addVaccinationForUser: builder.mutation<
        void,
        { eventId: string; userId: string; vaccinationId: string }
    >({
      query: ({ eventId, userId, vaccinationId }) => ({
        url: `/volunteer/events/${eventId}/users/${userId}/vaccinations`,
        method: "POST",
        body: { vaccinationId },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "VolunteerEvent", id: arg.eventId }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetEventRegistrationsQuery, useAddVaccinationForUserMutation } = volunteerApi;
