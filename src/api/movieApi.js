import axiosInstance from "./axiosInstance";

export const movieApi = {
  getMovieList: (groupId = "GP01", page = 1, pageSize = 8, movieName = "") => {
    let url = `/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=${groupId}&soTrang=${page}&soPhanTuTrenTrang=${pageSize}`;

    if (movieName && movieName.trim() !== "") {
      url += `&tenPhim=${encodeURIComponent(movieName.trim())}`;
    }

    return axiosInstance.get(url);
  },

  getMovieDetail: (groupId) => {
    return axiosInstance.get(`/QuanLyPhim/LayThongTinPhim?maPhim=${groupId}`);
  },
};
