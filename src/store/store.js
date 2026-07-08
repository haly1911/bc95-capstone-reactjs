import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingSlice";
import authReducer from "./slices/authSlice";
import { authMiddleware } from "./middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
  },
  middleware: () => [authMiddleware],
});
