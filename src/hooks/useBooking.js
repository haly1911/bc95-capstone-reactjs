import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectorSelectedSeats, confirmPayment, initBooking } from "../store/slices/bookingSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "../api/bookingApi";
import { toast } from "react-toastify";

export const useNavigateBooking = () => {
  const selectedSeats = useSelector(selectorSelectedSeats);
  const navigate = useNavigate();
  const handleNavigateBooking = (movie, showtime, complexName) => {
    navigate("/booking", {
      state: {
        movieInfo: {
          tenPhim: movie.tenPhim,
          hinhAnh: movie.hinhAnh,
          maPhim: movie.maPhim,
        },
        showtimeInfo: {
          maLichChieu: showtime.maLichChieu,
          ngayChieuGioChieu: showtime.ngayChieuGioChieu,
          giaVe: showtime.giaVe,
          tenCumRap: complexName,
          tenRap: showtime.tenRap,
        },
        selectedSeats,
      },
    });
  };
  return handleNavigateBooking;
};

export const useSeatMap = (showtimeId) => {
  return useQuery({
    queryKey: ["seatMap", showtimeId],
    queryFn: async () => {
      const response = await bookingApi.getSeatMap(showtimeId);
      return response.data.content;
    },
  });
};

export const useBookTickets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await bookingApi.bookTickets(bookingData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      dispatch(confirmPayment([]));
      dispatch(initBooking());

      queryClient.invalidateQueries({ queryKey: ["seatMap", variables.maLichChieu] });

      toast.success("🎉 Thanh toán và đặt vé thành công!");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.content || "Đặt vé thất bại, vui lòng thử lại!";
      toast.error(`❌ Lỗi: ${errorMsg}`);
      console.log(error);
    },
  });
};
