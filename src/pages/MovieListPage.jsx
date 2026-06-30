import React, { useState } from "react";
import { useMovieList } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useDebounce } from "../hooks/useDebounce";
import { all } from "axios";

const MovieListPage = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedQuery = useDebounce(query, 500);

  const pageSize = statusFilter === "all" ? 8 : 100;

  // Gọi API lấy danh sách phim phân trang
  const { data, isLoading, isError, error } = useMovieList("GP01", page, pageSize, debouncedQuery);

  const movies = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  const filteredMovies = movies.filter((movie) => {
    if (statusFilter === "dangChieu") return movie.dangChieu === true;
    if (statusFilter === "sapChieu") return movie.sapChieu === true;
    if (statusFilter === "hot") return movie.hot === true;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col pt-20 pb-10">
      {/* HERO BANNER */}
      {!isLoading && !isError && (
        <section className="relative isolate overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            navigation={true}
            pagination={{ clickable: true }}
            className="hero-movie-swiper"
          >
            {movies
              .filter((movie) => movie.hot === true)
              .map((movie) => (
                <SwiperSlide key={movie.maPhim}>
                  <div className="relative overflow-hidden grid gap-8 lg:grid-cols-3 px-6 py-12 sm:px-16 lg:px-24 items-center min-h-120 lg:min-h-138S">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105 opacity-40 blur-[3px] lg:opacity-25 lg:blur-xs"
                      style={{ backgroundImage: `url(${movie.hinhAnh})` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent lg:bg-linear-to-r lg:from-black lg:via-black/70 lg:to-black/30" />
                    <div className="relative z-10 flex flex-col justify-center gap-4 text-left lg:col-span-2">
                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F0BB3B]/40 bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F0BB3B] backdrop-blur-sm">
                        ✦ Phim đề cử tuần này
                      </span>
                      <h1 className="text-2xl font-black sm:text-4xl lg:text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {movie.tenPhim}
                      </h1>
                      <p className="max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base lg:text-gray-300 line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {movie.moTa}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <Link
                          to={`/movies/${movie.maPhim}`}
                          className="flex items-center gap-2 rounded-full bg-[#F0BB3B] px-6 py-3 text-sm font-bold text-black shadow-lg shadow-[#F0BB3B]/30 transition hover:scale-105 hover:bg-[#dfac30]"
                        >
                          <i className="fa-solid fa-ticket text-xs"></i>Đặt vé ngay
                        </Link>
                        <Link
                          to={`/movies/${movie.maPhim}`}
                          className="flex items-center gap-2 rounded-full border border-white/60 bg-black/20 px-6 py-3 text-sm font-semibold backdrop-blur-md transition hover:border-[#F0BB3B] hover:text-[#F0BB3B] text-white"
                        >
                          <i className="fa-solid fa-play text-xs"></i>Xem trailer
                        </Link>
                      </div>
                    </div>
                    <div className="relative z-10 hidden lg:block lg:col-span-1 visual-poster">
                      <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-[#F0BB3B]/30 to-transparent blur-xl opacity-50" />
                      <img
                        src={movie.hinhAnh}
                        alt={movie.tenPhim}
                        className="relative mx-auto h-95 w-65 rounded-2xl border border-[#F0BB3B]/50 object-cover shadow-[0_0_30px_rgba(240,187,59,0.25)]"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </section>
      )}

      <section className="wrapper">
        {/* SEARCH + DROPDOWN FILTER */}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] py-8">
          {/* Thanh Tìm Kiếm */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm opacity-50">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm phim..."
              className="h-12 w-full rounded-full border border-gray-700 bg-mauve-800 pl-11 pr-4 text-sm outline-none transition focus:border-[#F0BB3B] focus:ring1 focus:ring-[#F0BB3B]/30"
            />
          </div>

          {/* Dropdown Bộ Lọc Trạng Thái Phim */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1); // Reset về trang 1 khi đổi bộ lọc dropdown
            }}
            className="h-12 rounded-full border border-gray-700 bg-mauve-800 text-sm font-semibold text-center outline-none transition focus:border-[#F0BB3B] focus:text-[#F0BB3B] cursor-pointer"
          >
            <option value="all">🎬 Tất cả</option>
            <option value="dangChieu">🔥 Đang Chiếu</option>
            <option value="sapChieu">⏳ Sắp Chiếu</option>
            <option value="hot">⭐ Phim Đang Hot</option>
          </select>
        </div>

        {/* MOVIE GRID */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Danh sách phim</h2>
        </div>

        {isLoading && <LoadingSpinner />}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
            <p className="text-gray-500">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && filteredMovies.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed bg-black/40 p-10 text-center">
            <p className="text-gray-500">Không tìm thấy phim phù hợp.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.maPhim} movie={movie} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {/* Nút Previous */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="grid h-10 w-10 place-items-center rounded-full border transition bg-black/20 disabled:opacity-40 disabled:pointer-events-none enabled:hover:border-[#F0BB3B] enabled:hover:text-[#F0BB3B] enabled:cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            {/* Danh sách các số trang */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const active = n === currentPage;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-bold transition cursor-pointer ${
                    active
                      ? "border-[#F0BB3B] bg-[#F0BB3B] text-black shadow-[0_0_15px_rgba(240,187,59,0.5)]"
                      : "bg-black/20 hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
                  }`}
                >
                  {n}
                </button>
              );
            })}

            {/* Nút Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="grid h-10 w-10 place-items-center rounded-full border transition bg-black/20 disabled:opacity-40 disabled:pointer-events-none enabled:hover:border-[#F0BB3B] enabled:hover:text-[#F0BB3B] enabled:cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}

        {/* TAG STRIP */}
        <div className="mt-16 rounded-2xl border border-[#F0BB3B]/20 bg-linear-120 from-[#2E0F46] to-[#610011] p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Thành viên <span className="text-[#F0BB3B]">Lumière Premium</span>
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
            Tích điểm mọi giao dịch, ưu đãi sinh nhật, vé miễn phí mỗi tháng và đặc quyền ghế ngồi VIP.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F0BB3B] px-6 py-3 text-sm font-bold text-black transition hover:scale-105"
          >
            Đăng ký ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MovieListPage;
