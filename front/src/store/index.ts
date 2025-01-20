// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import UserService from "src/store/users";
import BlockchainService from "src/store/blockchains";

export const store = configureStore({
  reducer: {
    UserService,
    BlockchainService,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type TDispatch = typeof store.dispatch;
export type TRootState = ReturnType<typeof store.getState>;
