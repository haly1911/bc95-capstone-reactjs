import React, { useState, useRef } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAddMovie, useDeleteMovie, useUpdateMovie, useMovieList } from "../../hooks/useMovies";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import PagePagination from "../../components/PagePagination";
import SearchFilterBar from "../../components/SearchFilterBar";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import MovieFormModal from "../../components/MovieFormModal";

const MovieManagementPage = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedQuery = useDebounce(query, 500);
  const pageSize = 8;
  const movieSectionRef = useRef(null);

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

  const movieManagementOptions = [
    { value: "all", label: "Tất Cả" },
    { value: "dangChieu", label: "Đang Chiếu" },
    { value: "sapChieu", label: "Sắp Chiếu" },
    { value: "hot", label: "Đang Hot" },
  ];

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setPage(newPage);
    movieSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenModal = (movie = null) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
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
          className="flex items-center gap-2 w-full sm:w-fit justify-center rounded-full bg-[#F0BB3B] hover:bg-[#dfac30] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#F0BB3B]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-clapperboard text-xs"></i> Thêm phim mới
        </button>
      </div>

      <SearchFilterBar
        searchQuery={query}
        onSearchChange={(val) => {
          setQuery(val);
          setPage(1);
        }}
        filterValue={statusFilter}
        onFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        placeholder="Tìm kiếm tên phim..."
        options={movieManagementOptions}
      />

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
                      <h4 className="text-lg font-bold text-white truncate">{movie.tenPhim}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{movie.moTa || "(Chưa có mô tả)"}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.hot && (
                          <span className="status-badge bg-red-500/20 text-red-400 border-red-500/30">
                            HOT
                          </span>
                        )}
                        {movie.dangChieu && (
                          <span className="status-badge bg-green-500/20 text-green-400 border-green-500/30">
                            ĐANG CHIẾU
                          </span>
                        )}
                        {movie.sapChieu && (
                          <span className="status-badge bg-blue-500/20 text-blue-400 border-blue-500/30">
                            SẮP CHIẾU
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 text-sm pt-2 border-t border-purple-950/20 mt-2">
                      <button
                        onClick={() => handleOpenModal(movie)}
                        className="action-icon text-blue-700 hover:text-blue-500"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </button>
                      <button
                        onClick={() => setMovieToDelete(movie)}
                        className="action-icon text-red-700 hover:text-red-500"
                      >
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
                            <span className="status-badge font-medium bg-red-500/10 text-red-400 border-red-500/20">Hot</span>
                          )}
                          {movie.dangChieu && (
                            <span className="status-badge font-medium bg-green-500/10 text-green-400 border-green-500/20">
                              Đang chiếu
                            </span>
                          )}
                          {movie.sapChieu && (
                            <span className="status-badge font-medium bg-blue-500/10 text-blue-400 border-blue-500/20">
                              Sắp chiếu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleOpenModal(movie)}
                            className="action-icon text-blue-700 hover:text-blue-500"
                            title="Chỉnh sửa"
                          >
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                          <button
                            onClick={() => setMovieToDelete(movie)}
                            className="action-icon text-red-700 hover:text-red-500"
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
          {!isLoading && !isError && (
            <PagePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
      {/* modal thêm/cập nhật phim */}
      <MovieFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingMovie={editingMovie}
        addMovieMutation={addMovie}
        updateMovieMutation={updateMovie}
      />
      {/* modal xác nhận xoá phim */}
      <DeleteConfirmModal
        open={!!movieToDelete}
        title="Xóa phim"
        message={movieToDelete ? `Bạn có chắc muốn xóa "${movieToDelete.tenPhim}"?` : ""}
        loading={deleteMovie.isPending}
        onClose={() => setMovieToDelete(null)}
        onConfirm={handleDeleteMovie}
      />
    </div>
  );
};

export default MovieManagementPage;
