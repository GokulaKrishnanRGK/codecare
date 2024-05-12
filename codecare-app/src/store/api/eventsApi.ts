import type Event from "../../models/events/Event";
import type {EventSearchParams} from "../../models/events/EventDto";
import type {ApiResponse, Paginated} from "./apiTypes";
import {baseApi} from "./baseApi";

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<Paginated<Event>, EventSearchParams | void>({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.keyword) query.set("keyword", params.keyword);
        if (params?.eventStatus) query.set("eventStatus", params.eventStatus);
        if (params?.location) query.set("location", params.location);
        if (params?.fromDate) query.set("fromDate", params.fromDate);
        if (params?.toDate) query.set("toDate", params.toDate);

        query.set("page", String(params?.page ?? 1));

        const qs = query.toString();
        return {url: `/events${qs ? `?${qs}` : ""}`, method: "GET"};
      },
      transformResponse: (response: ApiResponse<Paginated<Event>>): Paginated<Event> => response.data,
      providesTags: (result) =>
          result
              ? [
                {type: "Events", id: "LIST"},
                ...result.items.map((ev) => ({type: "Event" as const, id: ev.id})),
              ]
              : [{type: "Events", id: "LIST"}],
    }),

    getEventById: builder.query<Event, string>({
      query: (id) => ({url: `/events/${id}`, method: "GET"}),
      transformResponse: (response: ApiResponse<Event>): Event => response.data,
      providesTags: (_result, _err, id) => [{type: "Event", id}],
    }),

    createEvent: builder.mutation<Event, FormData>({
      query: (body) => ({url: `/events`, method: "POST", body}),
      transformResponse: (response: ApiResponse<Event>): Event => response.data,
      invalidatesTags: [{type: "Events", id: "LIST"}],
    }),

    updateEvent: builder.mutation<Event, { id: string; body: FormData }>({
      query: ({id, body}) => ({url: `/events/${id}`, method: "PUT", body}),
      transformResponse: (response: ApiResponse<Event>): Event => response.data,
      invalidatesTags: (_res, _err, arg) => [
        {type: "Events", id: "LIST"},
        {type: "Event", id: arg.id},
      ],
    }),

    deleteEvent: builder.mutation<Event, string>({
      query: (id) => ({url: `/events/${id}`, method: "DELETE"}),
      transformResponse: (response: ApiResponse<Event>): Event => response.data,
      invalidatesTags: (_res, _err, id) => [
        {type: "Events", id: "LIST"},
        {type: "Event", id},
      ],
    }),

    registerForEvent: builder.mutation<void, { id: string }>({
      query: ({id}) => ({url: `/events/${id}/register`, method: "POST"}),
      invalidatesTags: (_r, _e, arg) => [{type: "Event", id: arg.id}, {type: "Events", id: "LIST"}],
    }),

    unregisterForEvent: builder.mutation<void, { id: string }>({
      query: ({id}) => ({url: `/events/${id}/unregister`, method: "POST"}),
      invalidatesTags: (_r, _e, arg) => [{type: "Event", id: arg.id}, {type: "Events", id: "LIST"}],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useRegisterForEventMutation,
  useUnregisterForEventMutation,
} = eventsApi;
