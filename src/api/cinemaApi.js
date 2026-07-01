import axiosInstance from "./axiosInstance";

export const cinemaApi = {
  getCinemaChains: () => {
    return axiosInstance.get("/QuanLyRap/LayThongTinHeThongRap");
  },
  getCinemaComplexesByChain: (chainId) => {
    return axiosInstance.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${chainId}`);
  },
};
