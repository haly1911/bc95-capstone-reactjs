import React, { useState, useEffect } from "react";
import { useCinemaChains } from "../hooks/useCinema";
import { useScheduleByChain } from "../hooks/useSchedule";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigateBooking } from "../hooks/useBooking";

const SchedulePage = () => {
  const [selectedChain, setSelectedChain] = useState("BHDStar");
  const [selectedComplex, setSelectedComplex] = useState("");

  const { data: cinemaChains, isLoading: isLoadingChains } = useCinemaChains();
  const { data: scheduleData, isLoading: isLoadingSchedule } = useScheduleByChain(selectedChain);

  const handleNavigateBooking = useNavigateBooking();

  useEffect(() => {
    if (scheduleData && scheduleData[0]?.lstCumRap?.length > 0) {
      setSelectedComplex(scheduleData[0].lstCumRap[0].maCumRap);
    }
  }, [scheduleData, selectedChain]);

  const currentComplexData = scheduleData?.[0]?.lstCumRap?.find((complex) => complex.maCumRap === selectedComplex);

  return (
    <div className="min-h-screen wrapper pt-40 pb-20 text-white">
      {/* Header Title */}
      <div className="pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Lịch chiếu <span className="text-[#f0bb3b] drop-shadow-[0_2px_10px_rgba(240,187,59,0.3)]">Phim</span>
        </h1>
        <p className="text-gray-400 text-lg">Chọn rạp yêu thích để cập nhật khung giờ chiếu mới nhất ngày hôm nay</p>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hệ thống rạp */}
          <div className="md:w-72 shrink-0">
            <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
              Hệ thống rạp
            </h2>
            {isLoadingChains ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {cinemaChains?.map((chain) => {
                  const isActive = selectedChain === chain.maHeThongRap;
                  return (
                    <button
                      key={chain.maHeThongRap}
                      onClick={() => setSelectedChain(chain.maHeThongRap)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-lg
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
                      <span className="font-semibold text-sm tracking-wide">{chain.tenHeThongRap}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isLoadingSchedule ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
                  Chọn điểm rạp chi tiết
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-950">
                  {scheduleData?.[0]?.lstCumRap?.map((complex) => {
                    const isSelected = selectedComplex === complex.maCumRap;
                    return (
                      <button
                        key={complex.maCumRap}
                        onClick={() => setSelectedComplex(complex.maCumRap)}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer
                          ${
                            isSelected
                              ? "bg-[#f0bb3b] border-[#f0bb3b] text-black font-semibold shadow-lg"
                              : "bg-[#2a1b35]/40 border-[#442c54]/30 text-gray-400 hover:text-white hover:border-[#f0bb3b]/40"
                          }`}
                      >
                        {complex.tenCumRap}
                      </button>
                    );
                  })}
                </div>
                {currentComplexData && (
                  <p className="text-xs text-gray-400 mb-6 italic bg-[#2a1b35]/20 border border-[#442c54]/20 p-3 rounded-lg flex items-center gap-2">
                    <span>📍 Địa chỉ:</span> {currentComplexData.diaChi}
                  </p>
                )}
                <div className="space-y-6">
                  {currentComplexData?.danhSachPhim?.length > 0 ? (
                    currentComplexData.danhSachPhim.map((movie) => {
                      const sortedShowtimes = movie.lstLichChieuTheoPhim
                        ? [...movie.lstLichChieuTheoPhim].sort(
                            (a, b) => new Date(a.ngayChieuGioChieu) - new Date(b.ngayChieuGioChieu),
                          )
                        : [];

                      return (
                        <div
                          key={movie.maPhim}
                          className="bg-[#2a1b35]/60 border border-[#442c54]/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#442c54]/80 transition-all"
                        >
                          {/* Poster Phim */}
                          <div className="w-full sm:w-32 h-44 shrink-0 overflow-hidden rounded-xl bg-purple-950/20 border border-[#442c54]/30">
                            <img
                              src={movie.hinhAnh}
                              alt={movie.tenPhim}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300";
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-lg font-bold text-white tracking-wide line-clamp-1">
                                {movie.tenPhim}
                              </h3>
                              {movie.hot && (
                                <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                  Hot
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-400 mb-4 font-medium">Khung giờ khởi chiếu hôm nay:</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                              {sortedShowtimes.length > 0 ? (
                                sortedShowtimes.map((showtime) => {
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
                                      onClick={() =>
                                        handleNavigateBooking(movie, showtime, currentComplexData?.tenCumRap)
                                      }
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
                                })
                              ) : (
                                <p className="text-xs text-gray-500 col-span-full">Không có suất chiếu</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 bg-[#2a1b35]/20 border border-[#442c54]/20 rounded-2xl">
                      <p className="text-gray-400 text-sm">Rạp này hiện chưa xếp lịch chiếu cho hôm nay.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
