import React from "react";

const PagePagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        <i className="fa-solid fa-arrow-left text-xs"></i>
      </button>
      {Array.from({ length: totalPages }).map((_, i) => {
        const n = i + 1;
        const active = n === currentPage;
        return (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-bold transition cursor-pointer ${
              active
                ? "border-[#F0BB3B] bg-[#F0BB3B] text-black shadow-[0_0_15px_rgba(240,187,59,0.4)]"
                : "border-gray-800 bg-black/20 text-gray-400 hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
            }`}
          >
            {n}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
      >
        <i className="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>
  );
};

export default PagePagination;
