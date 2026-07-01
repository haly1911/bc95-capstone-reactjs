import React, { useState } from "react";
import { useCinemaChains, useCinemaComplexesByChain } from "../hooks/useCinema";
import LoadingSpinner from "../components/LoadingSpinner";

const CinemaPage = () => {
  const [selectedCinemaChain, setSelectedCinemaChain] = useState("BHDStar");
  const { data: cinemaChainsList, isLoading: isLoadingCinemaChains } =
    useCinemaChains();

  const { data: cinemaComplexesList, isLoading: isLoadingCinemaComplexes } =
    useCinemaComplexesByChain(selectedCinemaChain);

  const handleSelectCinemaChain = (chainId) => {
    setSelectedCinemaChain(chainId);
  };

  const renderSelectedCinemaChain = cinemaChainsList?.find(
    (cinemaChain) => cinemaChain.maHeThongRap === selectedCinemaChain,
  );

  return (
    <div className="min-h-screen wrapper pt-40">
      <div className="pb-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Hệ thống{" "}
          <span className="text-[#f0bb3b] drop-shadow-[0_2px_10px_rgba(240,187,59,0.3)]">
            Rạp chiếu
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Chọn chuỗi rạp để xem danh sách địa điểm
        </p>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {isLoadingCinemaChains && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-80 shrink-0">
            <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
              Chuỗi rạp
            </h2>
            <div className="space-y-3">
              {cinemaChainsList?.map((cinemaChain) => {
                const isActive =
                  selectedCinemaChain === cinemaChain.maHeThongRap;
                return (
                  <button
                    key={cinemaChain.maHeThongRap}
                    onClick={() =>
                      handleSelectCinemaChain(cinemaChain.maHeThongRap)
                    }
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-lg
                      ${
                        isActive
                          ? "bg-[#f0bb3b]/10 border-[#f0bb3b] text-[#f0bb3b] shadow-[0_0_15px_rgba(240,187,59,0.15)]"
                          : "bg-[#2a1b35]/60 border-[#442c54]/50 text-gray-400 hover:bg-[#342242]/80 hover:border-[#f0bb3b]/50 hover:text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                      }`}
                  >
                    <img
                      src={cinemaChain.logo}
                      alt={cinemaChain.tenHeThongRap}
                      className="w-10 h-10 object-contain rounded-lg bg-white p-1 shadow-md"
                    />
                    <span className="font-semibold text-sm tracking-wide">
                      {cinemaChain.tenHeThongRap}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6 border-b border-purple-950/40 pb-4">
              <img
                src={renderSelectedCinemaChain?.logo}
                alt={renderSelectedCinemaChain?.tenHeThongRap}
                className="w-12 h-12 object-contain bg-white rounded-xl p-1 shadow-lg"
              />
              <h2 className="text-2xl font-bold tracking-wide text-white">
                {renderSelectedCinemaChain?.tenHeThongRap}
              </h2>
            </div>
            <div className="space-y-4">
              {cinemaComplexesList?.map((cinemaComplex) => (
                <div
                  key={cinemaComplex.maCumRap}
                  className="bg-[#2a1b35]/60 border border-[#442c54]/50 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-gray-300 hover:bg-[#342242]/80 hover:border-[#f0bb3b]/50 rounded-xl transition-all duration-300 p-6 group"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl group-hover:text-[#f0bb3b] transition-colors duration-200">
                        {cinemaComplex.tenCumRap}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1.5 flex items-start gap-2">
                        <span className="text-[#f0bb3b]">📍</span>
                        <span className="leading-relaxed">
                          {cinemaComplex.diaChi}
                        </span>
                      </p>
                    </div>
                    <span className="text-[#f0bb3b] text-xs font-semibold bg-[#f0bb3b]/10 border border-[#f0bb3b]/20 px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-center">
                      {cinemaComplex.danhSachRap.length} phòng chiếu
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-950/20">
                    {cinemaComplex.danhSachRap.map((screen) => (
                      <span
                        key={screen.maRap}
                        className="bg-black/30 border border-purple-950/50 text-gray-400 text-xs px-3 py-1.5 rounded-lg hover:border-[#f0bb3b]/30 hover:text-white transition-colors cursor-default"
                      >
                        {screen.tenRap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaPage;
