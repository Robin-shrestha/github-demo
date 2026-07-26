import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import counterReducer from "./counterSlice";
import { studentsApi } from "./studentsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    // RTK Query keeps its cache in its own slice of the store.
    [studentsApi.reducerPath]: studentsApi.reducer,
  },
  // ...and needs its middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(studentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
