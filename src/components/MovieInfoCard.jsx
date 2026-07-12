import React from "react";

const MovieInfoCard = ({ movie }) => {
  if (!movie) {
    return (
      <div className="flex min-h-170 items-center justify-center rounded-2xl border border-[#F0BB3B]/30 bg-[#2A0617]/60 p-8">
        <div className="text-center">
          <span className="text-6xl">🎬</span>
          <h2 className="text-2xl font-bold text-white py-5">Chưa chọn phim</h2>
          <p className="text-gray-400">
            Hãy chọn một bộ phim để xem thông tin
            <br />
            và tạo lịch chiếu.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-[#F0BB3B]/30 bg-[#2A0617]/60 p-6">
      <div className="relative overflow-hidden rounded-xl">
        {movie.hot && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            HOT
          </span>
        )}
        <img src={movie.hinhAnh} alt={movie.tenPhim} className="h-117 w-full object-cover" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-[#F0BB3B]">{movie.tenPhim}</h2>
      <div className="mt-6 space-y-4">
        <div className="flex justify-between border-b border-white/10 pb-3">
          <span className="font-semibold text-[#F0BB3B]">Mã phim</span>
          <span className="text-gray-300">{movie.maPhim}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-3">
          <span className="font-semibold text-[#F0BB3B]">Ngày khởi chiếu</span>
          <span className="text-gray-300">{new Date(movie.ngayKhoiChieu).toLocaleDateString("vi-VN")}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-3">
          <span className="font-semibold text-[#F0BB3B]">Đánh giá</span>
          <span className="text-gray-300">⭐ {movie.danhGia}/10</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-[#F0BB3B]">Trạng thái</span>
          <span
            className={`font-semibold ${
              movie.dangChieu ? "text-green-400" : movie.sapChieu ? "text-orange-400" : "text-red-400"
            }`}
          >
            {movie.dangChieu ? "Đang chiếu" : movie.sapChieu ? "Sắp chiếu" : "Ngừng chiếu"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoCard;
