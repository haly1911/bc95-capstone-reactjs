import React from "react";

const ShowtimeGrid = ({ showtimes, movie, complexName, onNavigateBooking }) => {
  const sortedShowtimes = showtimes
    ? [...showtimes].sort((a, b) => new Date(a.ngayChieuGioChieu) - new Date(b.ngayChieuGioChieu))
    : [];

  if (sortedShowtimes.length === 0) {
    return <p className="text-xs text-gray-500 col-span-full">Không có suất chiếu</p>;
  }

  return (
    <div className="max-h-50 overflow-y-auto pr-1 sm:pr-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        {sortedShowtimes.map((showtime) => {
          const dateObj = new Date(showtime.ngayChieuGioChieu);
          const timeString = dateObj.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const dateString = dateObj
            .toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
            .replace(/-/g, "/");
          return (
            <button
              key={showtime.maLichChieu}
              onClick={() => onNavigateBooking(movie, showtime, complexName)}
              className="bg-black/40 border border-[#442c54]/60 hover:border-[#f0bb3b] hover:bg-[#f0bb3b]/10 hover:text-[#f0bb3b] text-gray-300 rounded-xl py-2 px-2 sm:px-3 text-center transition-all duration-200 group cursor-pointer flex flex-col items-center justify-center min-w-25"
            >
              <span className="font-bold text-sm tracking-wide group-hover:scale-105 transition-transform">
                {timeString}
              </span>
              <span className="text-xs text-gray-500 mt-0.5 group-hover:text-[#f0bb3b]/80 whitespace-nowrap">
                {dateString} - {showtime.giaVe.toLocaleString()}đ
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShowtimeGrid;
