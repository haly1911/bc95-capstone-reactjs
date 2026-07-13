import React from "react";

const CinemaChainList = ({ chains, selectedChain, onSelectChain }) => {
  return (
    <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-thin scrollbar-thumb-purple-950">
      {chains?.map((chain) => {
        const isActive = selectedChain === chain.maHeThongRap;
        return (
          <button
            key={chain.maHeThongRap}
            onClick={() => onSelectChain(chain.maHeThongRap)}
            className={`w-auto lg:w-full flex items-center gap-3 lg:gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-lg shrink-0 snap-start ${
              isActive
                ? "bg-[#f0bb3b]/10 border-[#f0bb3b] text-[#f0bb3b] shadow-[0_0_15px_rgba(240,187,59,0.15)]"
                : "bg-[#2a1b35]/60 border-[#442c54]/50 text-gray-400 hover:bg-[#342242]/80 hover:border-[#f0bb3b]/50 hover:text-white"
            }`}
          >
            <img
              src={chain.logo}
              alt={chain.tenHeThongRap}
              className="brand-logo"
            />
            <span className="font-semibold text-sm tracking-wide whitespace-nowrap lg:whitespace-normal text-left hidden sm:inline-block">
              {chain.tenHeThongRap}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CinemaChainList;
