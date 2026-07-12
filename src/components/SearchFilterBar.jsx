import React from "react";

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
  placeholder = "Tìm kiếm...",
  options = [],
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      {/* Ô Tìm Kiếm */}
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm opacity-50">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-[#442c54]/50 bg-[#16091F] pl-11 pr-4 text-sm outline-none transition focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30 text-white"
        />
      </div>
      {/* Dropdown Filter */}
      <div className="relative flex-1 sm:flex-none">
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-11 w-full sm:w-45 rounded-xl border border-[#442c54]/50 bg-[#16091F] pl-3 pr-8 text-xs font-medium text-gray-300 outline-none transition focus:border-[#F0BB3B] cursor-pointer appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#16091F]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
          <i className="fa-solid fa-filter"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
