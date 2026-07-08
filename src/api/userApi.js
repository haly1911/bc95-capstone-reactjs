import axiosInstance from "./axiosInstance";

export const userApi = {
  getUserList: (groupId = "GP01", page = 1, pageSize = 20, keyword = "") => {
    let url = `/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang?MaNhom=${groupId}&soTrang=${page}&soPhanTuTrenTrang=${pageSize}`;
    if (keyword && keyword.trim() !== "") {
      url += `&tuKhoa=${encodeURIComponent(keyword.trim())}`;
    }
    return axiosInstance.get(url);
  },
  getProfile: () => {
    return axiosInstance.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },
  addUser: (userData) => {
    return axiosInstance.post("/QuanLyNguoiDung/ThemNguoiDung", userData);
  },
  updateUser: (userData) => {
    return axiosInstance.post("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", userData);
  } 
};
