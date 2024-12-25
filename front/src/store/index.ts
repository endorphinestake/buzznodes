// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import UserService from "src/store/users";

export const store = configureStore({
  reducer: {
    UserService,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type TDispatch = typeof store.dispatch;
export type TRootState = ReturnType<typeof store.getState>;
