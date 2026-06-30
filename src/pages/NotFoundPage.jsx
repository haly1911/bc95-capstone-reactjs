import React from "react";

const NotFoundPage = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
      <div className="font-serif text-4xl tracking-wide mb-7 select-none">
        Lumière<span className="text-[#F0BB3B]">.</span>
      </div>
      <h1 className="text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-b from-[#F0BB3B] to-[#dfb55c] drop-shadow-lg select-none">
        404
      </h1>
      <div className="mt-4 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mt-2">
          Suất chiếu này không tồn tại!
        </h2>
        <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
          Đường liên kết bạn vừa nhập có vẻ đã bị hỏng, lỗi tỷ lệ khung hình
          hoặc bộ phim này đã ngừng khởi chiếu.
        </p>
      </div>
      <div className="mt-8">
        <button
          onClick={handleGoHome}
          className="px-8 py-3 bg-[#F0BB3B] text-black font-semibold rounded-full cursor-pointer hover:bg-[#dfb55c] hover:shadow-xl hover:shadow-[#F0BB3B]/20 active:scale-95 transition-all shadow-lg shadow-[#F0BB3B]/10"
        >
          <i className="fa-solid fa-house mr-2"></i> Quay về Trang Chủ
        </button>
      </div>
      <p className="absolute bottom-6 text-xs opacity-40 select-none">
        © Lumière Cinemas • Mọi quyền được bảo lưu.
      </p>
    </div>
  );
};

export default NotFoundPage;
