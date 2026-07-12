import React from "react";

const MovieSummarySidebar = ({
  movieInfo,
  showtimeInfo,
  selectedSeats = [],
  totalAmount = 0,
  variant = "booking",
  onRemoveSeat,
  children,
}) => {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-6 self-start lg:col-span-1 w-full">
      {variant === "booking" && (
        <div className="relative h-50 rounded-3xl overflow-hidden shrink-0">
          <img src={movieInfo?.hinhAnh} className="w-full h-full object-cover" alt={movieInfo?.tenPhim} />
          <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1.5 text-xs uppercase tracking-widest rounded-full bg-black/40 backdrop-blur">
            2D Phụ Đề
          </span>
          <div className="absolute left-0 bottom-0 w-full py-3 px-3 z-10 text-[#f0bb3b] bg-black/80">
            <h3 className="text-2xl tracking-widest text-center truncate">{movieInfo?.tenPhim}</h3>
          </div>
        </div>
      )}
      <div className="bg-[#2a1b35]/40 border border-[#442c54]/50 backdrop-blur-lg rounded-3xl p-6 text-lg mb-4">
        {variant === "payment" ? (
          <div className="border-b border-[#442c54]/40 pb-3 mb-4">
            <h4 className="font-bold text-2xl text-[#f0bb3b] leading-tight">{movieInfo?.tenPhim}</h4>
            <span className="text-xs text-gray-400">2D Phụ Đề</span>
          </div>
        ) : (
          <h3 className="text-lg font-bold mb-4 border-b border-[#442c54]/40 pb-3 text-white">Thông tin đơn hàng</h3>
        )}
        <div className="space-y-2 border-b border-[#442c54]/30 pb-4 mb-4 text-sm text-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-400">Rạp</span>
            <span className="font-medium text-right">{showtimeInfo?.tenCumRap || movieInfo?.tenCumRap}</span>
          </div>
          {(showtimeInfo?.tenRap || movieInfo?.tenRap) && (
            <div className="flex justify-between">
              <span className="text-gray-400">Phòng chiếu</span>
              <span className="text-[#f0bb3b] font-semibold">{showtimeInfo?.tenRap || movieInfo?.tenRap}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Suất chiếu</span>
            <span className="font-medium text-[#f0bb3b]">{showtimeInfo?.gioChieu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ngày chiếu</span>
            <span className="capitalize">{showtimeInfo?.ngayChieu}</span>
          </div>
        </div>
        <div className="border-b border-[#442c54]/30 pb-4 mb-4 text-sm">
          <span className="text-gray-400 block mb-2">Danh sách ghế ({selectedSeats.length})</span>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
            {selectedSeats.length === 0 ? (
              <p className="italic text-xs text-[#8a85a8]">Chưa có ghế nào được chọn</p>
            ) : (
              selectedSeats.map((seat) => (
                <div
                  key={seat.maGhe || seat.tenGhe}
                  className="px-2 py-0.5 text-xs font-semibold rounded bg-[#f0bb3b] text-black flex items-center gap-1"
                >
                  <span>Ghế {seat.tenGhe}</span>
                  {onRemoveSeat && (
                    <button
                      onClick={() => onRemoveSeat(seat)}
                      className="hover:text-red-600 ml-1 text-sm font-bold cursor-pointer transition-colors"
                      title="Hủy chọn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-sm text-gray-400">Số tiền cần thanh toán</span>
          <span className="font-bold text-2xl text-[#f0bb3b]">{totalAmount.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </aside>
  );
};

export default MovieSummarySidebar;
