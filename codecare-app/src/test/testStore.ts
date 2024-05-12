import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "@/store/api/baseApi";

const rootReducer = combineReducers({
  api: baseApi.reducer,
});

export function makeTestStore(preloadedState?: any) {
  return configureStore({
    reducer: rootReducer,
    middleware: (gDM) => gDM().concat(baseApi.middleware),
    preloadedState,
  });
}

export type TestStore = ReturnType<typeof makeTestStore>;
export type RootState = ReturnType<typeof rootReducer>;
