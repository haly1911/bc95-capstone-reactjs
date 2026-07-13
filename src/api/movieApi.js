import axiosInstance from "./axiosInstance";

export const movieApi = {
  getMovieList: (groupId = "GP01", page = 1, pageSize = 8, movieName = "") => {
    let url = `/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=${groupId}&soTrang=${page}&soPhanTuTrenTrang=${pageSize}`;

    if (movieName && movieName.trim() !== "") {
      url += `&tenPhim=${encodeURIComponent(movieName.trim())}`;
    }

    return axiosInstance.get(url);
  },

  getMovieDetail: (movieId) => {
    return axiosInstance.get(`/QuanLyPhim/LayThongTinPhim?maPhim=${movieId}`);
  },
  addMovie: (formData) => {
    return axiosInstance.post("/QuanLyPhim/ThemPhimUploadHinh", formData);
  },
  updateMovie: (formData) => {
    return axiosInstance.post("/QuanLyPhim/CapNhatPhimUpload", formData);
  },
  deleteMovie: (movieId) => {
    return axiosInstance.delete(`/QuanLyPhim/XoaPhim?MaPhim=${movieId}`);
  },
};
