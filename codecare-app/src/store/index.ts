import { configureStore } from "@reduxjs/toolkit";
import {loginUserSlice} from "./loginUser-slice.ts";

export const store = configureStore({
    reducer: {
        [loginUserSlice.name] : loginUserSlice.reducer
    }
});

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;