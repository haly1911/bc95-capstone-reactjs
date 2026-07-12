import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { confirmPayment, initBooking } from "../store/slices/bookingSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigateBooking, useBookTickets } from "../hooks/useBooking";
import MovieSummarySidebar from "../components/MovieSummarySidebar";

const cardSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .required("Số thẻ không được để trống")
    .matches(/^\d{16}$/, "Số thẻ phải bao gồm đúng 16 chữ số"),
  cardExpiry: Yup.string()
    .required("Ngày hết hạn không được để trống")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Định dạng phải là MM/YY (VD: 12/28)"),
  cardCvc: Yup.string()
    .required("Mã CVC không được để trống")
    .matches(/^\d{3}$/, "Mã CVC gồm đúng 3 chữ số mặt sau thẻ"),
});

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavigateBooking = useNavigateBooking();
  const { mutate: bookTickets, isPending } = useBookTickets();

  const { movieInfo, showtimeInfo, selectedSeats = [], totalAmount = 0 } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);

  const cardFormik = useFormik({
    initialValues: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
    validationSchema: cardSchema,
    onSubmit: () => {
      executePaymentLogic();
    },
  });

  if (!showtimeInfo || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Không tìm thấy thông tin thanh toán hợp lệ.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#f0bb3b] text-black px-6 py-2 rounded-full font-bold cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const executePaymentLogic = () => {
    const bookingPayload = {
      maLichChieu: showtimeInfo.maLichChieu,
      danhSachVe: selectedSeats.map((seat) => ({
        maGhe: seat.maGhe,
        giaVe: seat.giaVe || showtimeInfo.giaVe,
      })),
    };
    bookTickets(bookingPayload);
  };

  const handleTriggerPayment = () => {
    if (paymentMethod === "stripe") {
      cardFormik.handleSubmit();
    } else {
      executePaymentLogic();
    }
  };

  return (
    <main className="min-h-screen wrapper pt-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Xác Nhận <span className="text-[#f0bb3b]">Thanh Toán</span>
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          Vui lòng kiểm tra lại thông tin vé và chọn phương thức thanh toán phù hợp.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-[#2a1b35]/40 border border-[#442c54]/50 rounded-3xl p-6 backdrop-blur-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#f0bb3b]">
                <i className="fa-solid fa-credit-card"></i> Chọn phương thức thanh toán
              </h3>

              <div className="space-y-4">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${paymentMethod === "momo" ? "bg-[#f0bb3b]/10 border-[#f0bb3b]" : "bg-black/20 border-[#442c54]/40 hover:border-[#f0bb3b]/40"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                      className="accent-[#f0bb3b] w-4 h-4 cursor-pointer"
                    />
                    <img
                      src="https://momo-chuyen-nhan-tien.vn.aptoide.com/_next/image?url=https%3A%2F%2Fcdn.aptoide.com%2Fimgs%2Fb%2Fc%2F3%2Fbc38432546ed5a7f7089d9577b348883_icon.png&w=256&q=75"
                      alt="MoMo"
                      className="w-10 h-10 rounded-lg object-cover bg-white p-1"
                    />
                    <div>
                      <p className="font-semibold text-sm">Ví Điện Tử MoMo</p>
                      <p className="text-xs text-gray-400">Thanh toán qua ứng dụng MoMo bằng mã QR</p>
                    </div>
                  </div>
                </label>
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${paymentMethod === "vnpay" ? "bg-[#f0bb3b]/10 border-[#f0bb3b]" : "bg-black/20 border-[#442c54]/40 hover:border-[#f0bb3b]/40"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="accent-[#f0bb3b] w-4 h-4 cursor-pointer"
                    />
                    <img
                      src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                      alt="VNPAY"
                      className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                    />
                    <div>
                      <p className="font-semibold text-sm">Cổng thanh toán VNPAY</p>
                      <p className="text-xs text-gray-400">Hỗ trợ ứng dụng ngân hàng qua QR-PAY, thẻ ATM nội địa</p>
                    </div>
                  </div>
                </label>
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${paymentMethod === "stripe" ? "bg-[#f0bb3b]/10 border-[#f0bb3b]" : "bg-black/20 border-[#442c54]/40 hover:border-[#f0bb3b]/40"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")} // 👉 SỬA LỖI Ở ĐÂY
                      className="accent-[#f0bb3b] w-4 h-4 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border text-[#1a1f71]">
                      <img src="https://cdn-icons-png.flaticon.com/512/8983/8983163.png" alt="card" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Thẻ Quốc Tế (Visa, Mastercard, JCB)</p>
                      <p className="text-xs text-gray-400">Yêu cầu thẻ có chức năng thanh toán trực tuyến</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* input thẻ */}
              {paymentMethod === "stripe" && (
                <div className="mt-6 border-t border-[#442c54]/50 pt-6 space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Thông tin thẻ tín dụng / ghi nợ</h4>

                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Số thẻ (16 chữ số)"
                      maxLength="16"
                      value={cardFormik.values.cardNumber}
                      onChange={cardFormik.handleChange}
                      onBlur={cardFormik.handleBlur}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-[#442c54]/60 bg-black/30 outline-none focus:border-[#f0bb3b] transition-all"
                    />
                    {cardFormik.touched.cardNumber && cardFormik.errors.cardNumber && (
                      <span className="text-red-400 text-xs px-1">{cardFormik.errors.cardNumber}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="Hạn thẻ (MM/YY)"
                        maxLength="5"
                        value={cardFormik.values.cardExpiry}
                        onChange={cardFormik.handleChange}
                        onBlur={cardFormik.handleBlur}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#442c54]/60 bg-black/30 outline-none focus:border-[#f0bb3b] transition-all"
                      />
                      {cardFormik.touched.cardExpiry && cardFormik.errors.cardExpiry && (
                        <span className="text-red-400 text-xs px-1">{cardFormik.errors.cardExpiry}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <input
                        type="password"
                        name="cardCvc"
                        placeholder="Mã CVC (3 số)"
                        maxLength="3"
                        value={cardFormik.values.cardCvc}
                        onChange={cardFormik.handleChange}
                        onBlur={cardFormik.handleBlur}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#442c54]/60 bg-black/30 outline-none focus:border-[#f0bb3b] transition-all"
                      />
                      {cardFormik.touched.cardCvc && cardFormik.errors.cardCvc && (
                        <span className="text-red-400 text-xs px-1">{cardFormik.errors.cardCvc}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 flex items-start gap-2 px-2">
              <i className="fa-solid fa-shield-halved text-[#f0bb3b] mt-0.5"></i>
              <p>
                Thông tin giao dịch của bạn được mã hoá hoàn toàn và bảo mật theo tiêu chuẩn quốc tế PCI DSS. Chúng tôi
                không lưu trữ thông tin thẻ ngân hàng của bạn
              </p>
            </div>
          </section>

          <MovieSummarySidebar
            movieInfo={movieInfo}
            showtimeInfo={showtimeInfo}
            selectedSeats={selectedSeats}
            totalAmount={totalAmount}
            variant="payment"
          >
            <button
              onClick={handleTriggerPayment}
              disabled={isPending}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
      ${
        isPending
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-[#f0bb3b] text-black hover:bg-[#e2af31] hover:scale-102 cursor-pointer shadow-lg shadow-[#f0bb3b]/10"
      }`}
            >
              {isPending ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Đang xử lý giao dịch...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Xác nhận thanh toán</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavigateBooking(movieInfo, showtimeInfo, showtimeInfo?.tenCumRap)}
              disabled={isPending}
              className="w-full mt-3 py-2 text-xs text-center text-gray-400 hover:text-white transition-colors cursor-pointer block"
            >
              Quay lại sửa ghế
            </button>
          </MovieSummarySidebar>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
