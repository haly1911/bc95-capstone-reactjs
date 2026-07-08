import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";
import { useScheduleByMovie } from "../hooks/useSchedule";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigateBooking } from "../hooks/useBooking";

const MovieDetailPage = () => {
  const { maPhim } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading: isLoadingMovie, isError: isMovieError } = useMovieDetail(maPhim);

  const { data: scheduleData, isLoading: isLoadingSchedule } = useScheduleByMovie(maPhim);

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState("");

  const handleNavigateBooking = useNavigateBooking();

  useEffect(() => {
    if (scheduleData && scheduleData.heThongRapChieu?.length > 0) {
      setSelectedChain(scheduleData.heThongRapChieu[0].maHeThongRap);
    }
  }, [scheduleData]);

  const currentChainData = scheduleData?.heThongRapChieu?.find((chain) => chain.maHeThongRap === selectedChain);

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isMovieError || !movie || !movie.maPhim) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Không tìm thấy thông tin phim</p>
          <Link to="/movie" className="text-[#f0bb3b] hover:underline inline-flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  // Hàm chuẩn hóa link Youtube watch -> embed
  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
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
                <span className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400 backdrop-blur">
                  <i className="fa-solid fa-fire text-red-500 mr-1"></i> HOT
                </span>
              )}
              {movie.dangChieu && (
                <span className="rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-400 backdrop-blur">
                  <i className="fa-solid fa-circle-check text-green-500 mr-1"></i> Đang chiếu
                </span>
              )}
              {movie.sapChieu && (
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 backdrop-blur">
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
                {new Date(movie.ngayKhoiChieu).toLocaleDateString("vi-VN").replace(/-/g, "/")}
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
              <a
                href="#booking"
                className="inline-flex items-center gap-2 rounded-full bg-[#f0bb3b] px-6 py-3 text-sm font-bold text-black shadow-lg shadow-[#f0bb3b]/20 transition hover:scale-105 hover:bg-[#e2af31]"
              >
                <i className="fa-solid fa-ticket"></i> Đặt vé ngay
              </a>
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
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
                {scheduleData.heThongRapChieu.map((chain) => {
                  const isActive = selectedChain === chain.maHeThongRap;
                  return (
                    <button
                      key={chain.maHeThongRap}
                      onClick={() => setSelectedChain(chain.maHeThongRap)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-lg shrink-0 md:shrink
                        ${
                          isActive
                            ? "bg-[#f0bb3b]/10 border-[#f0bb3b] text-[#f0bb3b] shadow-[0_0_15px_rgba(240,187,59,0.15)]"
                            : "bg-[#2a1b35]/60 border-[#442c54]/50 text-gray-400 hover:bg-[#342242]/80 hover:border-[#f0bb3b]/50 hover:text-white"
                        }`}
                    >
                      <img
                        src={chain.logo}
                        alt={chain.tenHeThongRap}
                        className="w-9 h-9 object-contain rounded-lg bg-white p-1"
                      />
                      <span className="font-semibold text-sm tracking-wide hidden sm:inline md:block">
                        {chain.tenHeThongRap}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
                Điểm chiếu & Suất chiếu
              </h3>

              <div className="space-y-4">
                {currentChainData?.cumRapChieu?.map((complex) => {
                  const sortedLichChieu = complex.lichChieuPhim
                    ? [...complex.lichChieuPhim].sort(
                        (a, b) => new Date(a.ngayChieuGioChieu) - new Date(b.ngayChieuGioChieu),
                      )
                    : [];
                  return (
                    <div
                      key={complex.maCumRap}
                      className="bg-[#2a1b35]/60 border border-[#442c54]/50 rounded-2xl p-6 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#442c54]/80 transition-all group"
                    >
                      {/* Thông tin cụm rạp */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 border-b border-purple-950/30 pb-4 mb-4">
                        <div>
                          <h4 className="text-white font-bold text-lg group-hover:text-[#f0bb3b] transition-colors duration-200">
                            {complex.tenCumRap}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-2">
                            <span className="text-[#f0bb3b]">📍</span> {complex.diaChi}
                          </p>
                        </div>
                        <span className="text-xs bg-purple-950/40 px-2.5 py-1 rounded text-gray-400 border border-[#442c54]/30 whitespace-nowrap">
                          2D Phụ Đề
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {sortedLichChieu.map((showtime) => {
                          const dateObj = new Date(showtime.ngayChieuGioChieu);
                          const timeString = dateObj.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          });
                          const dateString = dateObj
                            .toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                            })
                            .replace(/-/g, "/");

                          return (
                            <button
                              key={showtime.maLichChieu}
                              onClick={() => handleNavigateBooking(movie, showtime, complex.tenCumRap)}
                              className="bg-black/40 border border-[#442c54]/60 hover:border-[#f0bb3b] hover:bg-[#f0bb3b]/10 hover:text-[#f0bb3b] text-gray-300 rounded-xl py-2 px-3 text-center transition-all duration-200 group/time cursor-pointer flex flex-col items-center justify-center"
                            >
                              <span className="font-bold text-sm tracking-wide group-hover/time:scale-105 transition-transform">
                                {timeString}
                              </span>
                              <span className="text-[10px] text-gray-500 mt-0.5 group-hover/time:text-[#f0bb3b]/80">
                                {dateString} - {showtime.giaVe.toLocaleString()}đ
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#2a1b35]/20 border border-[#442c54]/20 rounded-2xl mt-6">
            <p className="text-gray-400 text-sm">Hiện tại phim này đang chưa có lịch chiếu trên hệ thống.</p>
          </div>
        )}
      </section>

      {/* POPUP MODAL TRAILER */}
      {trailerOpen && movie.trailer && (
        <div
          onClick={() => setTrailerOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 backdrop-blur-sm"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#f0bb3b]/20 shadow-2xl">
              <iframe
                src={`${getEmbedUrl(movie.trailer)}?autoplay=1`}
                title={`Trailer ${movie.tenPhim}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
