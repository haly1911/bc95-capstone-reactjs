import React from "react";
import { Link } from "react-router-dom";
import { formatMovieDateTimeDisplay } from "../utils/date";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie.maPhim}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#F0BB3B]/50 transition hover:-translate-y-1 hover:shadow-yellow-500 hover:shadow-2xl/30 hover:cursor-pointer"
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={movie.hinhAnh}
          alt={movie.tenPhim}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-overlay opacity-80" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.hot && (
            <span className="bg-red-500 text-white text-center text-xs font-bold px-2 py-1 rounded-full">HOT</span>
          )}
          {movie.dangChieu && (
            <span className="bg-yellow-500 text-black text-center text-xs font-bold px-2 py-1 rounded-full">
              Đang chiếu
            </span>
          )}
          {movie.sapChieu && (
            <span className="bg-violet-500 text-white text-center text-xs font-bold px-2 py-1 rounded-full">
              Sắp chiếu
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 backdrop-blur">
          <span className="text-xs">⭐</span>
          <span className="text-sm font-semibold">{movie.danhGia}</span>
        </div>
        <div className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F0BB3B]">
            <i className="fa-solid fa-play"></i>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 flex flex-1 flex-col justify-center gap-1 p-4 bg-black/80 w-full h-1/4">
        <h3 className="text-xl font-bold transition group-hover:text-[#F0BB3B] truncate">{movie.tenPhim}</h3>
        <div className="text-sm text-gray-300">{formatMovieDateTimeDisplay(movie.ngayKhoiChieu)}</div>
      </div>
    </Link>
  );
};

export default MovieCard;
