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
          className="h-11 pl-11 pr-4 input-field"
        />
      </div>
      {/* Dropdown Filter */}
      <div className="relative flex-1 sm:flex-none">
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-btn"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
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
