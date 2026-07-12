import React, { useEffect, useRef, useState } from "react";
import { useMovieList } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import Banner from "../components/Banner";
import MovieTrailerPopup from "../components/MovieTrailerPopup";
import PagePagination from "../components/PagePagination";
import SearchFilterBar from "../components/SearchFilterBar";

const MovieListPage = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const movieSectionRef = useRef(null);
  const debouncedQuery = useDebounce(query, 500);
  const pageSize = statusFilter === "all" ? 8 : 100;

  // gọi API lấy danh sách phim phân trang
  const { data, isLoading, isError, error } = useMovieList("GP01", page, pageSize, debouncedQuery);
  const movies = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  // gọi API lấy toàn bộ phim cho banner (để )
  const { data: bannerData } = useMovieList("GP01", 1, 100, "");
  const bannerMovies = bannerData?.items || [];

  const filteredMovies = movies.filter((movie) => {
    if (statusFilter === "dangChieu") return movie.dangChieu === true;
    if (statusFilter === "sapChieu") return movie.sapChieu === true;
    if (statusFilter === "hot") return movie.hot === true;
    return true;
  });

  const movieOptions = [
    { value: "all", label: "🎬 Tất cả" },
    { value: "dangChieu", label: "🔥 Đang Chiếu" },
    { value: "sapChieu", label: "⏳ Sắp Chiếu" },
    { value: "hot", label: "⭐ Phim Đang Hot" },
  ];

  const handleOpenTrailer = (movie) => {
    setSelectedMovie(movie);
    setTrailerOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setPage(newPage);
    movieSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* HERO BANNER */}
      {!isLoading && !isError && <Banner movies={bannerMovies} onWatchTrailer={(movie) => handleOpenTrailer(movie)} />}

      <section className="wrapper">
        {/* SEARCH + DROPDOWN FILTER */}
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
          placeholder="Tìm kiếm phim..."
          options={movieOptions}
        />

        {/* MOVIE GRID */}
        <div ref={movieSectionRef} className="mt-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Danh sách <span className="text-[#F0BB3B] drop-shadow-[0_2px_10px_rgba(240,187,59,0.2)]">phim</span></h2>
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
        {!isLoading && !isError && (
          <PagePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}

        {/* TAG STRIP */}
        <div className="mt-16 rounded-2xl border border-[#F0BB3B]/20 bg-linear-120 from-[#2E0F46] to-[#610011] p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Thành viên <span className="text-[#F0BB3B] drop-shadow-[0_2px_10px_rgba(240,187,59,0.2)]">Lumière Premium</span>
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
      {/* trailer popup */}
      <MovieTrailerPopup isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} movie={selectedMovie} />
    </div>
  );
};

export default MovieListPage;
