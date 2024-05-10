import {configureStore} from "@reduxjs/toolkit";
import {loginUserSlice} from "./loginUser-slice.ts";
import {noteSlice} from "./noteSlice.ts";
import {profileSlice} from "./ProfileSlice.ts"
import {usersSlice} from "./users-slice.ts";
import {appointmentSlice} from "./appointment-slice.ts";
import {eventsApi} from "./api/eventsApi.ts";

export const store = configureStore({
  reducer: {
    [loginUserSlice.name]: loginUserSlice.reducer,
    [noteSlice.name]: noteSlice.reducer,
    [profileSlice.name]: profileSlice.reducer,
    [usersSlice.name]: usersSlice.reducer,
    [appointmentSlice.name]: appointmentSlice.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eventsApi.middleware),
});

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;