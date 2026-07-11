import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAddMovie, useDeleteMovie, useUpdateMovie, useMovieList } from "../../hooks/useMovies";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "react-toastify";

// const validationSchema = (editingMovie) =>
//   Yup.object().shape({
//     tenPhim: Yup.string().required("Tên phim không được để trống"),
//     trailer: Yup.string().url("Trailer phải là đường dẫn URL hợp lệ").required("Trailer không được để trống"),
//     moTa: Yup.string().required("Mô tả không được để trống"),
//     ngayKhoiChieu: Yup.string().required("Ngày khởi chiếu không được để trống"),
//     danhGia: Yup.number().min(0, "Tối thiểu là 0").max(10, "Tối đa là 10").required("Đánh giá không được để trống"),
//     hinhAnh: editingMovie ? Yup.mixed() : Yup.mixed().required("Vui lòng chọn hình ảnh"),
//   });
const addMovieSchema = () =>
  Yup.object().shape({
    tenPhim: Yup.string().required("Tên phim không được để trống"),
    trailer: Yup.string().url("Trailer phải là đường dẫn URL hợp lệ").required("Trailer không được để trống"),
    moTa: Yup.string().required("Mô tả không được để trống"),
    ngayKhoiChieu: Yup.string().required("Ngày khởi chiếu không được để trống"),
    danhGia: Yup.number().min(0, "Tối thiểu là 0").max(10, "Tối đa là 10").required("Đánh giá không được để trống"),
    hinhAnh: Yup.mixed().required("Vui lòng chọn hình ảnh"),
  });
const updateMovieSchema = () =>
  Yup.object().shape({
    tenPhim: Yup.string().required("Tên phim không được để trống"),
    trailer: Yup.string().url("Trailer phải là đường dẫn URL hợp lệ").required("Trailer không được để trống"),
    moTa: Yup.string().required("Mô tả không được để trống"),
    ngayKhoiChieu: Yup.string().required("Ngày khởi chiếu không được để trống"),
    danhGia: Yup.number().min(0, "Tối thiểu là 0").max(10, "Tối đa là 10").required("Đánh giá không được để trống"),
    hinhAnh: Yup.mixed().nullable(),
  });

const MovieManagementPage = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedQuery = useDebounce(query, 500);
  const pageSize = 8;
  const movieSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  const { data, isLoading, isError, error } = useMovieList("GP01", page, pageSize, debouncedQuery);

  const movies = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;
  const totalCount = data?.totalCount || 0;

  const addMovie = useAddMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  const filteredMovies = movies.filter((movie) => {
    if (statusFilter === "dangChieu") return movie.dangChieu === true;
    if (statusFilter === "sapChieu") return movie.sapChieu === true;
    if (statusFilter === "hot") return movie.hot === true;
    return true;
  });

  const formik = useFormik({
    initialValues: {
      tenPhim: "",
      trailer: "",
      moTa: "",
      ngayKhoiChieu: "",
      sapChieu: false,
      dangChieu: false,
      hot: false,
      danhGia: "",
      hinhAnh: null,
    },
    validationSchema: editingMovie ? updateMovieSchema : addMovieSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("sapChieu", values.sapChieu);
      formData.append("dangChieu", values.dangChieu);
      formData.append("hot", values.hot);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", "GP01");

      if (values.ngayKhoiChieu) {
        const [year, month, day] = values.ngayKhoiChieu.split("-");
        formData.append("ngayKhoiChieu", `${day}/${month}/${year}`);
      }
      if (editingMovie) {
        formData.append("maPhim", editingMovie.maPhim);
      }
      if (values.hinhAnh instanceof File) {
        formData.append("hinhAnh", values.hinhAnh);
      }
      if (editingMovie) {
        updateMovie.mutate(formData, {
          onSuccess: () => {
            toast.success("Cập nhật thông tin phim thành công!");
            handleCloseModal();
          },
          onError: (err) => {
            toast.error(err.response?.data?.content ?? "Có lỗi từ máy chủ, vui lòng thử lại.");
          },
        });
      } else {
        addMovie.mutate(formData, {
          onSuccess: () => {
            toast.success("Thêm phim mới thành công 🎉");
            handleCloseModal();
          },
          onError: (err) => {
            console.error("Update Error:", err.response?.data);
            toast.error(
              err.response?.data?.content || err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
            );
          },
        });
      }
    },
  });

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setPage(newPage);
    movieSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCloseModal = () => {
    formik.resetForm();
    setIsModalOpen(false);
    setEditingMovie(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenModal = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      const formattedDate = movie.ngayKhoiChieu ? movie.ngayKhoiChieu.split("T")[0] : "";
      formik.setValues({
        tenPhim: movie.tenPhim || "",
        trailer: movie.trailer || "",
        moTa: movie.moTa || "",
        ngayKhoiChieu: formattedDate,
        sapChieu: !!movie.sapChieu,
        dangChieu: !!movie.dangChieu,
        hot: !!movie.hot,
        danhGia: movie.danhGia || 5,
        hinhAnh: null,
      });
      formik.setTouched({});
      setImagePreview(movie.hinhAnh || "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setEditingMovie(null);
      formik.resetForm();
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formik.setFieldValue("hinhAnh", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDeleteMovie = () => {
    if (!movieToDelete) return;
    deleteMovie.mutate(movieToDelete.maPhim, {
      onSuccess: () => {
        toast.success(`Xóa bộ phim "${movieToDelete.tenPhim}" thành công!`);
        setMovieToDelete(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.content || "Xóa phim thất bại!");
        setMovieToDelete(null);
      },
    });
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("hinhAnh", null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div ref={movieSectionRef} className="flex min-h-screen wrapper flex-col">
      {(isLoading || addMovie.isPending || updateMovie.isPending || deleteMovie.isPending) && <LoadingSpinner />}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">
            Danh Sách <span className="text-[#F0BB3B]">Phim</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Hiển thị <span className="text-[#F0BB3B] font-medium">{movies.length}</span> / {totalCount} phim trên hệ
            thống
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-full bg-[#F0BB3B] hover:bg-[#dfac30] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#F0BB3B]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-clapperboard text-xs"></i> Thêm phim mới
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 w-full max-w-4xl">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm opacity-50">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm tên phim..."
            className="h-11 w-full rounded-xl border border-[#442c54]/50 bg-[#16091F] pl-11 pr-4 text-sm outline-none transition focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30"
          />
        </div>
        <div className="relative flex-1 sm:flex-none">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full sm:w-40 rounded-xl border border-[#442c54]/50 bg-[#16091F] pl-3 pr-8 text-xs font-medium text-gray-300 outline-none transition focus:border-[#F0BB3B] cursor-pointer appearance-none"
          >
            <option value="all" className="bg-[#16091F]">
              Tất Cả
            </option>
            <option value="dangChieu" className="bg-[#16091F]">
              Đang Chiếu
            </option>
            <option value="sapChieu" className="bg-[#16091F]">
              Sắp Chiếu
            </option>
            <option value="hot" className="bg-[#16091F]">
              Đang Hot
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
            <i className="fa-solid fa-filter"></i>
          </div>
        </div>
      </div>

      {isError && (
        <div className="text-center py-20 bg-black/30 rounded-2xl border border-red-500/20">
          <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
          <p className="text-gray-500 text-sm">{error?.message || "Không thể tải danh sách phim"}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {filteredMovies.length === 0 ? (
              <div className="text-center sm:col-span-2 py-10 text-gray-500 bg-black/40 rounded-xl border border-gray-800">
                Không tìm thấy phim phù hợp
              </div>
            ) : (
              filteredMovies.map((movie) => (
                <div
                  key={movie.maPhim}
                  className="bg-[#2A0617]/40 border border-purple-950/50 p-4 rounded-xl flex gap-4"
                >
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="w-20 h-28 object-cover rounded-lg border border-[#F0BB3B]/50 shadow"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{movie.tenPhim}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{movie.moTa || "(Chưa có mô tả)"}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.hot && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            HOT
                          </span>
                        )}
                        {movie.dangChieu && (
                          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            ĐANG CHIẾU
                          </span>
                        )}
                        {movie.sapChieu && (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            SẮP CHIẾU
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 text-sm pt-2 border-t border-purple-950/20 mt-2">
                      <button onClick={() => handleOpenModal(movie)} className="text-blue-500 hover:text-blue-400">
                        <i className="fa-solid fa-pencil"></i>
                      </button>
                      <button onClick={() => setMovieToDelete(movie)} className="text-red-500 hover:text-red-400">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="hidden lg:block overflow-x-auto bg-[#16091F] border border-[#442c54]/50 backdrop-blur-lg text-gray-300 rounded-xl">
            <table className="min-w-full text-sm text-left">
              <thead className="font-semibold border-b border-[#442c54]/50 space-x-2">
                <tr>
                  <th className="pl-6 py-4 w-24">Hình ảnh</th>
                  <th className="py-4">Tên Phim</th>
                  <th className="py-4 w-1/4">Mô tả</th>
                  <th className="py-4 text-center">Đánh giá</th>
                  <th className="py-4">Trạng thái</th>
                  <th className="py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 bg-[#1E1326]">
                {filteredMovies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      Không tìm thấy phim phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredMovies.map((movie) => (
                    <tr key={movie.maPhim} className="transition hover:bg-[#2A0617]/50 space-x-2">
                      <td className="py-3 pl-6">
                        <img
                          src={movie.hinhAnh}
                          alt={movie.tenPhim}
                          className="w-14 h-20 object-cover rounded border border-gray-700"
                        />
                      </td>
                      <td className="py-4 font-bold text-gray-200 max-w-xs truncate">{movie.tenPhim}</td>
                      <td className="py-4 text-gray-400 pr-4">
                        <p className="line-clamp-3 text-xs">
                          {movie.moTa || <span className="italic text-gray-600">Chưa có nội dung mô tả...</span>}
                        </p>
                      </td>
                      <td className="py-4 text-center text-[#F0BB3B] font-bold">
                        <i className="fa-solid fa-star text-xs mr-1"></i>
                        {movie.danhGia}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {movie.hot && (
                            <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-medium">
                              Hot
                            </span>
                          )}
                          {movie.dangChieu && (
                            <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-medium">
                              Đang chiếu
                            </span>
                          )}
                          {movie.sapChieu && (
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-medium">
                              Sắp chiếu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleOpenModal(movie)}
                            className="text-blue-500 hover:text-blue-400 transition hover:scale-110 cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                          <button
                            onClick={() => setMovieToDelete(movie)}
                            className="text-red-500 hover:text-red-400 transition hover:scale-110 cursor-pointer"
                            title="Xóa phim"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-800 bg-black/20 disabled:opacity-40 disabled:pointer-events-none enabled:hover:border-[#F0BB3B] enabled:hover:text-[#F0BB3B] enabled:cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const active = n === currentPage;
                return (
                  <button
                    key={n}
                    onClick={() => handlePageChange(n)}
                    className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-bold transition cursor-pointer ${
                      active
                        ? "border-[#F0BB3B] bg-[#F0BB3B] text-black shadow-[0_0_15px_rgba(240,187,59,0.4)]"
                        : "border-gray-800 bg-black/20 text-gray-400 hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-800 bg-black/20 disabled:opacity-40 disabled:pointer-events-none enabled:hover:border-[#F0BB3B] enabled:hover:text-[#F0BB3B] enabled:cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL THÊM HOẶC CẬP NHẬT PHIM */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-xs overflow-y-auto py-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-linear-to-b from-[#16091F] to-[#2A0617] rounded-2xl border border-[#442c54]/50 shadow-2xl overflow-hidden my-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#442c54]/50 bg-black/30">
              <h3 className="text-white text-lg font-bold">
                {editingMovie ? "Cập nhật" : "Thêm"} <span className="text-[#F0BB3B]">phim điện ảnh</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Tên phim</label>
                  <input
                    type="text"
                    {...formik.getFieldProps("tenPhim")}
                    placeholder="Nhập tên bộ phim"
                    className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B]"
                  />
                  {formik.touched.tenPhim && formik.errors.tenPhim && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.tenPhim}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Trailer URL (Youtube)</label>
                  <input
                    type="text"
                    {...formik.getFieldProps("trailer")}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B]"
                  />
                  {formik.touched.trailer && formik.errors.trailer && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.trailer}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Mô tả nội dung phim</label>
                <textarea
                  rows="3"
                  {...formik.getFieldProps("moTa")}
                  placeholder="Nội dung tóm tắt cốt truyện cốt phim..."
                  className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B] resize-none"
                />
                {formik.touched.moTa && formik.errors.moTa && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.moTa}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Ngày khởi chiếu</label>
                  <input
                    type="date"
                    {...formik.getFieldProps("ngayKhoiChieu")}
                    className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B] text-gray-300"
                  />
                  {formik.touched.ngayKhoiChieu && formik.errors.ngayKhoiChieu && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.ngayKhoiChieu}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Đánh giá điểm số (0 - 10)</label>
                  <input
                    type="number"
                    {...formik.getFieldProps("danhGia")}
                    className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B]"
                  />
                  {formik.touched.danhGia && formik.errors.danhGia && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.danhGia}</p>
                  )}
                </div>
              </div>

              {/* Phần Checkbox quản lý Tags Trạng Thái hệ thống hiển thị */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Trạng thái hiển thị (Tags)</label>
                <div className="flex gap-6 py-2.5 px-3 bg-black/20 border border-[#442c54]/30 rounded-lg">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formik.values.dangChieu}
                      onChange={(e) => formik.setFieldValue("dangChieu", e.target.checked)}
                      className="rounded text-[#F0BB3B] focus:ring-0 bg-transparent border-gray-700 w-4 h-4"
                    />{" "}
                    Đang chiếu
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formik.values.sapChieu}
                      onChange={(e) => formik.setFieldValue("sapChieu", e.target.checked)}
                      className="rounded text-[#F0BB3B] focus:ring-0 bg-transparent border-gray-700 w-4 h-4"
                    />{" "}
                    Sắp chiếu
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formik.values.hot}
                      onChange={(e) => formik.setFieldValue("hot", e.target.checked)}
                      className="rounded text-[#F0BB3B] focus:ring-0 bg-transparent border-gray-700 w-4 h-4"
                    />{" "}
                    Phim HOT
                  </label>
                </div>
              </div>

              {/* Upload & Xem trước Ảnh */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Hình ảnh Poster phim</label>
                <div className="flex items-center gap-4 p-2 bg-black/10 border border-[#442c54]/30 rounded-lg">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-950/40 file:text-gray-300 hover:file:bg-purple-900/50 cursor-pointer flex-1"
                  />
                  {imagePreview && (
                    <div className="relative group w-12 h-16 border border-[#F0BB3B]/40 rounded shadow-md overflow-visible bg-black">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />

                      {/* Nút X nhỏ màu đỏ nằm đè lên góc phải của ảnh */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#F0BB3B] text-black transition hover:scale-110 active:scale-95 cursor-pointer z-10"
                        title="Xóa hình ảnh vừa chọn"
                      >
                        <i className="fa-solid fa-xmark fa-2xs"></i>
                      </button>
                    </div>
                  )}
                </div>
                {formik.touched.hinhAnh && formik.errors.hinhAnh && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.hinhAnh}</p>
                )}
              </div>

              {/* Khu vực nút bấm cuối form */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#442c54]/50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-gray-400 hover:text-white border border-[#442c54]/50 hover:border-[#F0BB3B]/50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formik.isValid || addMovie.isPending || updateMovie.isPending}
                  className="bg-[#F0BB3B] hover:bg-[#dfac30] disabled:bg-yellow-800/50 disabled:cursor-not-allowed text-gray-950 font-bold px-6 py-2 rounded-full text-sm shadow-lg cursor-pointer"
                >
                  {addMovie.isPending || updateMovie.isPending
                    ? "Đang xử lý..."
                    : editingMovie
                      ? "Lưu thay đổi"
                      : "Thêm phim mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL XÓA PHIM */}
      {!!movieToDelete && (
        <div
          onClick={() => setMovieToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-linear-to-br from-[#16091F] to-[#2A0617] rounded-2xl border border-red-950/40 w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-xl mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 className="text-white text-lg font-black mb-1">Xác nhận xóa phim?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Bạn có chắc chắn muốn gỡ bỏ hoàn toàn bộ phim{" "}
              <span className="text-[#F0BB3B] font-bold">"{movieToDelete.tenPhim}"</span> ra khỏi danh sách hệ thống rạp
              chiếu không?
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setMovieToDelete(null)}
                className="px-5 py-2 rounded-full text-sm font-semibold text-gray-400 hover:text-white border border-gray-700 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteMovie}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-full text-sm shadow-lg cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManagementPage;
