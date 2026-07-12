import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";

const MovieTrailerPopup = ({ isOpen, onClose, movie }) => {
  if (!isOpen || !movie || !movie.trailer) return null;

  // Hàm chuẩn hóa link Youtube watch -> embed
  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl">
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#f0bb3b]/20 shadow-2xl">
          <iframe
            src={`${getEmbedUrl(movie.trailer)}?autoplay=1`}
            title={`Trailer ${movie.tenPhim}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MovieTrailerPopup;
