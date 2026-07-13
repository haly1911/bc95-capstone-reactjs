import React, { useState, useEffect } from "react";
import { useCinemaChains } from "../hooks/useCinema";
import { useScheduleByChain } from "../hooks/useSchedule";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigateBooking } from "../hooks/useBooking";
import CinemaChainList from "../components/CinemaChainList";
import ShowtimeGrid from "../components/ShowtimeGrid";

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
    <div className="min-h-screen wrapper pt-40 text-white">
      <div className="pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Lịch chiếu <span className="text-[#f0bb3b] drop-shadow-[0_2px_10px_rgba(240,187,59,0.3)]">Phim</span>
        </h1>
        <p className="text-gray-400 text-lg">Chọn rạp yêu thích để cập nhật khung giờ chiếu mới nhất ngày hôm nay</p>
      </div>
      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 shrink-0">
            <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
              Hệ thống rạp
            </h2>
            {isLoadingChains ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <CinemaChainList
                chains={cinemaChains}
                selectedChain={selectedChain}
                onSelectChain={setSelectedChain}
              />
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
                  {scheduleData?.[0]?.lstCumRap?.map((complex) => (
                    <button
                      key={complex.maCumRap}
                      onClick={() => setSelectedComplex(complex.maCumRap)}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                        selectedComplex === complex.maCumRap
                          ? "bg-[#f0bb3b] border-[#f0bb3b] text-black font-semibold shadow-lg"
                          : "bg-[#2a1b35]/40 border-[#442c54]/30 text-gray-400 hover:text-white"
                      }`}
                    >
                      {complex.tenCumRap}
                    </button>
                  ))}
                </div>
                {currentComplexData && (
                  <p className="text-xs text-gray-400 mb-6 italic bg-[#2a1b35]/20 border border-[#442c54]/20 p-3 rounded-lg flex items-center gap-2">
                    <span>📍 Địa chỉ:</span> {currentComplexData.diaChi}
                  </p>
                )}
                <div className="space-y-6">
                  {currentComplexData?.danhSachPhim?.length > 0 ? (
                    currentComplexData.danhSachPhim.map((movie) => (
                      <div
                        key={movie.maPhim}
                        className="bg-[#2a1b35]/60 border border-[#442c54]/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                      >
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
                            <h3 className="text-lg font-bold text-white tracking-wide line-clamp-1">{movie.tenPhim}</h3>
                            {movie.hot && (
                              <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase">
                                Hot
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-4 font-medium">Khung giờ khởi chiếu hôm nay:</p>
                          <ShowtimeGrid
                            showtimes={movie.lstLichChieuTheoPhim}
                            movie={movie}
                            complexName={currentComplexData?.tenCumRap}
                            onNavigateBooking={handleNavigateBooking}
                          />
                        </div>
                      </div>
                    ))
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
