import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";
import { useScheduleByMovie } from "../hooks/useSchedule";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigateBooking } from "../hooks/useBooking";
import MovieTrailerPopup from "../components/MovieTrailerPopup";
import CinemaChainList from "../components/CinemaChainList";
import ShowtimeGrid from "../components/ShowtimeGrid";
import { formatDateDisplay } from "../utils/date";

const MovieDetailPage = () => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState("");
  const { maPhim } = useParams();

  const { data: movie, isLoading: isLoadingMovie, isError: isMovieError } = useMovieDetail(maPhim);
  const { data: scheduleData, isLoading: isLoadingSchedule } = useScheduleByMovie(maPhim);
  const handleNavigateBooking = useNavigateBooking();

  useEffect(() => {
    if (scheduleData && scheduleData.heThongRapChieu?.length > 0) {
      setSelectedChain(scheduleData.heThongRapChieu[0].maHeThongRap);
    }
  }, [scheduleData]);

  const currentChainData = scheduleData?.heThongRapChieu?.find((chain) => chain.maHeThongRap === selectedChain);

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isMovieError || !movie || !movie.maPhim) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Không tìm thấy thông tin phim</p>
          <Link to="/movie" className="text-[#f0bb3b] hover:underline inline-flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const handleScrollToBooking = (e) => {
    e.preventDefault();
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <section className="relative isolate overflow-hidden pt-32">
        <div className="absolute inset-0 -z-10">
          <img src={movie.hinhAnh} alt={movie.tenPhim} className="h-full w-full object-cover opacity-10 blur-md" />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/90 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <Link
            to="/movie"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#f0bb3b] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:py-16">
          <div className="mx-auto w-full max-w-xs lg:max-w-none">
            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-3xl bg-[#f0bb3b]/10 opacity-60 blur-2xl" />
              <img
                src={movie.hinhAnh}
                alt={movie.tenPhim}
                className="aspect-2/3 w-full rounded-2xl border border-[#442c54]/50 object-cover shadow-2xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {movie.hot && (
                <span className="status-badge bg-red-500/10 border-red-500/30 uppercase tracking-wider text-red-400 backdrop-blur">
                  <i className="fa-solid fa-fire text-red-500 mr-1"></i> HOT
                </span>
              )}
              {movie.dangChieu && (
                <span className="status-badge bg-green-500/10 border-green-500/30 uppercase tracking-wider text-green-400 backdrop-blur">
                  <i className="fa-solid fa-circle-check text-green-500 mr-1"></i> Đang chiếu
                </span>
              )}
              {movie.sapChieu && (
                <span className="status-badge bg-blue-500/10 border-blue-500/30 uppercase tracking-wider text-blue-400 backdrop-blur">
                  <i className="fa-solid fa-clock text-blue-500 mr-1"></i> Sắp chiếu
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl text-white tracking-tight">{movie.tenPhim}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5 bg-[#2a1b35]/40 px-3 py-1.5 rounded-lg border border-[#442c54]/30">
                <div className="flex gap-0.5 mr-1">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <i
                      key={index}
                      className={`fa-solid fa-star text-xs ${index < movie.danhGia ? "text-[#f0bb3b]" : "text-gray-700"}`}
                    ></i>
                  ))}
                </div>
                <strong className="text-[#f0bb3b] font-bold">{movie.danhGia}</strong>
                /10
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-calendar-days text-[#f0bb3b] mr-1"></i>{" "}
                {formatDateDisplay(movie.ngayKhoiChieu)}
              </span>
            </div>
            {movie.moTa && (
              <div className="bg-[#2a1b35]/40 border border-[#442c54]/40 rounded-xl p-5 max-w-3xl backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                <p className="text-base leading-relaxed text-gray-300">{movie.moTa}</p>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-3">
              {movie.trailer && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#442c54]/50 bg-[#2a1b35]/60 px-6 py-3 text-sm font-semibold text-gray-300 backdrop-blur transition hover:bg-[#f0bb3b] hover:text-black hover:border-transparent cursor-pointer shadow-md"
                >
                  <i className="fa-solid fa-play"></i> Xem trailer
                </button>
              )}
              <button
                onClick={handleScrollToBooking}
                className="inline-flex items-center gap-2 rounded-full bg-[#f0bb3b] px-6 py-3 text-sm font-bold text-black shadow-lg shadow-[#f0bb3b]/20 transition hover:scale-105 hover:bg-[#e2af31] cursor-pointer"
              >
                <i className="fa-solid fa-ticket"></i> Đặt vé ngay
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        id="booking"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 border-t border-purple-950/30"
      >
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Lịch chiếu <span className="text-[#f0bb3b] drop-shadow-[0_2px_10px_rgba(240,187,59,0.2)]">Phim</span>
          </h2>
          <p className="mt-1 text-sm text-gray-400">Chọn hệ thống rạp yêu thích và suất chiếu phù hợp với bạn</p>
        </div>
        {isLoadingSchedule ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : scheduleData?.heThongRapChieu?.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-72 shrink-0">
              <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
                Hệ thống rạp
              </h3>
              <CinemaChainList
                chains={scheduleData.heThongRapChieu}
                selectedChain={selectedChain}
                onSelectChain={setSelectedChain}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
                Điểm chiếu & Suất chiếu
              </h3>
              <div className="space-y-4">
                {currentChainData?.cumRapChieu?.map((complex) => (
                  <div
                    key={complex.maCumRap}
                    className="bg-[#2a1b35]/60 border border-[#442c54]/50 rounded-2xl p-6 backdrop-blur-lg group"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 border-b border-purple-950/30 pb-4 mb-4">
                      <div>
                        <h4 className="text-white font-bold text-lg group-hover:text-[#f0bb3b] transition-colors">
                          {complex.tenCumRap}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-2">
                          <span className="text-[#f0bb3b]">📍</span> {complex.diaChi}
                        </p>
                      </div>
                      <span className="text-xs bg-purple-950/40 px-2.5 py-1 rounded text-gray-400 border border-[#442c54]/30">
                        2D Phụ Đề
                      </span>
                    </div>
                    <ShowtimeGrid
                      showtimes={complex.lichChieuPhim}
                      movie={movie}
                      complexName={complex.tenCumRap}
                      onNavigateBooking={handleNavigateBooking}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#2a1b35]/20 border border-[#442c54]/20 rounded-2xl mt-6">
            <p className="text-gray-400 text-sm">Hiện tại phim này đang chưa có lịch chiếu trên hệ thống.</p>
          </div>
        )}
      </section>
      {/* trailer popup */}
      <MovieTrailerPopup isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} movie={movie} />
    </div>
  );
};

export default MovieDetailPage;
