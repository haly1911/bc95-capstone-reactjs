import axiosInstance from "./axiosInstance";

export const authApi = {
  login: (data) => {
    return axiosInstance.post("/QuanLyNguoiDung/DangNhap", data, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
  },
};
