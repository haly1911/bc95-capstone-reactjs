import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authMiddleware } from "./middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: () => [authMiddleware],
});
