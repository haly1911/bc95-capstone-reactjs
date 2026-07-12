import axiosInstance from "./axiosInstance";

export const scheduleApi = {
  getScheduleByChain: (chainId, groupId = "GP01") => {
    return axiosInstance.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${chainId}&maNhom=${groupId}`);
  },
  getScheduleByMovie: (movieId) => {
    return axiosInstance.get(`/QuanLyRap/LayThongTinLichChieuPhim?maPhim=${movieId}`);
  },
  createSchedule: (data) => {
    return axiosInstance.post("/QuanLyDatVe/TaoLichChieu", data);
  },
};
