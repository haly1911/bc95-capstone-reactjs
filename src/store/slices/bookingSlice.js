import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seatList: [],
  selectedSeats: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    initBooking: (state) => {
      state.selectedSeats = [];
    },
    selectSeat: (state, action) => {
      const selectedSeat = action.payload;
      const index = state.selectedSeats.findIndex((seat) => seat.maGhe === selectedSeat.maGhe);

      if (index === -1) {
        state.selectedSeats.push(selectedSeat);
      } else {
        state.selectedSeats.splice(index, 1);
      }
    },
    confirmPayment: (state, action) => {
      const paidSeats = action.payload || state.selectedSeats;

      const paidSeatIds = paidSeats.map((s) => s.maGhe);

      state.seatList.forEach((seat) => {
        if (paidSeatIds.includes(seat.maGhe)) {
          seat.daDat = true;
        }
      });
      state.selectedSeats = [];
    },
  },
});

export const { selectSeat, confirmPayment, initBooking } = bookingSlice.actions;

export const selectorSelectedSeats = (state) => state.booking.selectedSeats;

export default bookingSlice.reducer;
