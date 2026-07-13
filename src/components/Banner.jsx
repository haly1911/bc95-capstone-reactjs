import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Banner = ({ movies, onWatchTrailer }) => {
  const hotMovies = movies?.filter((movie) => movie.hot === true) || [];
  if (hotMovies.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden mb-10">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        navigation={true}
        pagination={{ clickable: true }}
        className="hero-movie-swiper"
      >
        {hotMovies
          .filter((movie) => movie.hot === true)
          .map((movie) => (
            <SwiperSlide key={movie.maPhim}>
              <div className="relative overflow-hidden grid gap-8 lg:grid-cols-3 px-6 py-12 sm:px-16 lg:px-24 items-center min-h-120 lg:min-h-138">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105 opacity-40 blur-xs lg:opacity-25"
                  style={{ backgroundImage: `url(${movie.hinhAnh})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent lg:bg-linear-to-r lg:from-black lg:via-black/70 lg:to-black/30" />
                <div className="relative z-10 flex flex-col justify-center gap-4 text-left lg:col-span-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F0BB3B]/40 bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F0BB3B] backdrop-blur-sm">
                    ✦ Phim đề cử tuần này
                  </span>
                  <h1 className="text-2xl font-black sm:text-4xl lg:text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {movie.tenPhim}
                  </h1>
                  <p className="max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base lg:text-gray-300 line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {movie.moTa}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link
                      to={`/movie/${movie.maPhim}`}
                      className="flex items-center gap-2 rounded-full bg-[#F0BB3B] px-6 py-3 text-sm font-bold text-black shadow-lg shadow-[#F0BB3B]/30 transition hover:scale-105 hover:bg-[#dfac30]"
                    >
                      <i className="fa-solid fa-ticket text-xs"></i>Đặt vé ngay
                    </Link>
                    <button
                      onClick={() => onWatchTrailer(movie)}
                      className="flex items-center gap-2 rounded-full border border-white/60 bg-black/20 px-6 py-3 text-sm font-semibold backdrop-blur-md transition hover:border-[#F0BB3B] hover:text-[#F0BB3B] text-white cursor-pointer"
                    >
                      <i className="fa-solid fa-play text-xs"></i>Xem trailer
                    </button>
                  </div>
                </div>
                <div className="relative z-10 hidden lg:block lg:col-span-1 visual-poster">
                  <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-[#F0BB3B]/30 to-transparent blur-xl opacity-50" />
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="relative mx-auto h-95 w-65 rounded-2xl border border-[#F0BB3B]/50 object-cover shadow-[0_0_30px_rgba(240,187,59,0.25)]"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};

export default Banner;
