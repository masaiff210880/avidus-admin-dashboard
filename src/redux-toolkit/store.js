import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { avidusApi } from "./service";

export const store = configureStore({
  reducer: {
    [avidusApi.reducerPath]: avidusApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(avidusApi.middleware),
});
setupListeners(store.dispatch);
