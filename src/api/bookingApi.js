import axiosInstance from "./axiosInstance";

export const bookingApi = {
  getSeatMap: (showtimeId) => {
    return axiosInstance.get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${showtimeId}`);
  },
  bookTickets: (bookingData) => {
    return axiosInstance.post("/QuanLyDatVe/DatVe", bookingData);
  },
};
