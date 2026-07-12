import React from "react";

const CinemaChainList = ({ chains, selectedChain, onSelectChain, variant = "vertical" }) => {
  return (
    <div
      className={`flex gap-3 overflow-x-auto pb-3 md:pb-0 ${
        variant === "vertical" ? "flex-row md:flex-col md:overflow-x-visible" : "space-y-3 flex-col"
      }`}
    >
      {chains?.map((chain) => {
        const isActive = selectedChain === chain.maHeThongRap;
        return (
          <button
            key={chain.maHeThongRap}
            onClick={() => onSelectChain(chain.maHeThongRap)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-lg shrink-0 md:shrink ${
              isActive
                ? "bg-[#f0bb3b]/10 border-[#f0bb3b] text-[#f0bb3b] shadow-[0_0_15px_rgba(240,187,59,0.15)]"
                : "bg-[#2a1b35]/60 border-[#442c54]/50 text-gray-400 hover:bg-[#342242]/80 hover:border-[#f0bb3b]/50 hover:text-white"
            }`}
          >
            <img
              src={chain.logo}
              alt={chain.tenHeThongRap}
              className="w-9 h-9 object-contain rounded-lg bg-white p-1 shadow-md"
            />
            <span className="font-semibold text-sm tracking-wide hidden sm:inline md:block">{chain.tenHeThongRap}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CinemaChainList;
