import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectorSelectedSeats, selectSeat, initBooking } from "../store/slices/bookingSlice";
import { data, useLocation, useNavigate, useParams } from "react-router-dom";
import { selectorIsLoggedIn } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useSeatMap } from "../hooks/useBooking";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieSummarySidebar from "../components/MovieSummarySidebar";

const BookingPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { showtimeInfo } = location.state || {};
  const showtimeId = showtimeInfo?.maLichChieu;
  const { data: apiResponse, isLoading, isError } = useSeatMap(showtimeId);

  const selectedSeats = useSelector(selectorSelectedSeats);
  const isLoggedIn = useSelector(selectorIsLoggedIn);
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0);

  if (!showtimeId) {
    return (
      <div className="min-h-screen bg-[#171528] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Không tìm thấy dữ liệu suất chiếu. Vui lòng chọn lại phim.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#f0bb3b] text-black px-6 py-2 rounded-full font-bold cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="text-white text-center pt-32">
        <LoadingSpinner />
      </div>
    );
  if (isError || !apiResponse)
    return <div className="text-white text-center pt-32">Không thể tải sơ đồ ghế. Vui lòng thử lại!</div>;

  const { thongTinPhim: movieInfo, danhSachGhe: seatList } = apiResponse;
  const giaGheThuong = seatList.find((seat) => seat.loaiGhe === "Thuong")?.giaVe || 0;
  const giaGheVip = seatList.find((seat) => seat.loaiGhe === "Vip")?.giaVe || 0;

  const handleSeatSelection = (seat) => {
    dispatch(selectSeat(seat));
  };

  // --- SEAT MAP RENDERING LOGIC USING .MAP() ---
  const SEATS_PER_ROW = 12;
  const totalRows = Math.ceil(seatList.length / SEATS_PER_ROW);

  const renderSeatMap = () => {
    return Array.from({ length: totalRows }).map((_, rowIndex) => {
      const rowLabel = String.fromCharCode(65 + rowIndex);

      const startIdx = rowIndex * SEATS_PER_ROW;
      const rawRowSeats = seatList.slice(startIdx, startIdx + SEATS_PER_ROW);

      // LOGIC QUAN TRỌNG: Nếu là hàng cuối và bị thiếu ghế, ta chủ động bù các phần tử null vào giữa
      let rowSeats = [...rawRowSeats];
      if (rowSeats.length < SEATS_PER_ROW) {
        const missingCount = SEATS_PER_ROW - rowSeats.length; // Ví dụ: 12 - 4 = 8 ô trống
        const leftPad = Math.floor(missingCount / 2); // Bù 4 ô trống bên trái
        const rightPad = Math.ceil(missingCount / 2); // Bù 4 ô trống bên phải

        rowSeats = [...Array(leftPad).fill(null), ...rawRowSeats, ...Array(rightPad).fill(null)];
      }

      const getSeatClass = (seat) => {
        if (seat.daDat) return "bg-[#3a2030] cursor-not-allowed text-white/20";
        const isSelected = selectedSeats.some((s) => s.maGhe === seat.maGhe);
        if (isSelected) return "bg-[#f0bb3b] text-[#221a08] font-bold cursor-pointer";
        if (seat.loaiGhe === "Vip") return "bg-[#5B3AA8] hover:bg-[#4c308e] cursor-pointer text-white";
        return "bg-[#2A2742] hover:bg-[#3a3660] cursor-pointer text-white/70";
      };

      // Render cụm ghế: Nếu gặp phần tử null (ô trống được bù) thì render một khoảng trống tàng hình
      const renderSeatCluster = (seatsInCluster) => {
        return seatsInCluster.map((seat, index) => {
          if (seat === null) {
            return <div key={`empty-${index}`} className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />;
          }
          return (
            <div
              key={seat.maGhe}
              title={`${seat.tenGhe} (${seat.loaiGhe})`}
              onClick={() => !seat.daDat && handleSeatSelection(seat)}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[10px] select-none shrink-0 ${getSeatClass(seat)}`}
            >
              {seat.tenGhe}
            </div>
          );
        });
      };

      return (
        <div key={rowLabel} className="flex items-center gap-2 sm:gap-4 mb-2 w-full justify-center">
          {/* Chữ cái đầu hàng cố định */}
          <div className="w-6 sm:w-10 shrink-0 text-[#f0bb3b] text-xs sm:text-base font-extrabold text-center">
            {rowLabel}
          </div>

          {/* Khung layout 3 cụm lúc này luôn nhận đủ 12 phần tử (gồm cả ghế thật và ô trống tàng hình) */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Cụm trái */}
            <div className="flex gap-1">{renderSeatCluster(rowSeats.slice(0, 3))}</div>

            {/* Cụm giữa */}
            <div className="flex gap-1">{renderSeatCluster(rowSeats.slice(3, 9))}</div>

            {/* Cụm phải */}
            <div className="flex gap-1">{renderSeatCluster(rowSeats.slice(9, 12))}</div>
          </div>
        </div>
      );
    });
  };

  const handlePayment = () => {
    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để tiến hành thanh toán giữ ghế!");
      navigate("/login", {
        state: {
          from: "/payment",
          bookingData: {
            movieInfo,
            showtimeInfo: { ...movieInfo, maLichChieu: showtimeId },
            selectedSeats,
            totalAmount,
          },
        },
      });
      return;
    }
    navigate("/payment", {
      state: { movieInfo, showtimeInfo, selectedSeats, totalAmount },
    });
  };

  return (
    <main className="wrapper">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pt-32 pb-16">
        <section className="bg-[#2a1b35]/40 border border-[#442c54]/50 backdrop-blur-lg rounded-3xl p-7 lg:col-span-2">
          <div className="mx-auto mb-8 max-w-140 text-center">
            <div className="h-2 rounded-t-full bg-linear-to-b from-[#f0bb3b] to-transparent shadow-[0_-18px_20px_2px_rgba(232,194,117,0.15)]" />
            <div className="mt-3 text-sm tracking-wider text-[#8a85a8]">M À N &nbsp; H Ì N H</div>
          </div>
          <div
            id="seatmap"
            className="flex flex-col items-center gap-1 sm:gap-2.5 pb-12 lg:pt-12 lg:pb-24 overflow-x-hidden"
          >
            {renderSeatMap()}
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-[#8a85a8]">
            <span>
              <span className="seat-color bg-[#2a2742] hover:bg-[#3a3660]" />
              Ghế Trống · {giaGheThuong.toLocaleString("vi-VN")} VND
            </span>
            <span>
              <span className="seat-color bg-[#5b3aa8]" />
              Ghế VIP · {giaGheVip.toLocaleString("vi-VN")} VND
            </span>
            <span>
              <span className="seat-color bg-[#f0bb3b]" />
              Ghế Đang Chọn
            </span>
            <span>
              <span className="seat-color bg-[#3a2030]" />
              Ghế Đã Bán
            </span>
          </div>
        </section>
        <MovieSummarySidebar
          movieInfo={movieInfo}
          showtimeInfo={{ ...movieInfo, maLichChieu: showtimeId }}
          selectedSeats={selectedSeats}
          totalAmount={totalAmount}
          variant="booking"
          onRemoveSeat={handleSeatSelection}
        >
          <button
            onClick={handlePayment}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wider duration-300 transition-all
      ${
        selectedSeats.length > 0
          ? "bg-[#f0bb3b] text-[#221a08] hover:scale-102 cursor-pointer"
          : "bg-white/5 text-white/20 cursor-not-allowed"
      }`}
            disabled={selectedSeats.length === 0}
          >
            Thanh Toán
          </button>
        </MovieSummarySidebar>
      </div>
    </main>
  );
};

export default BookingPage;
