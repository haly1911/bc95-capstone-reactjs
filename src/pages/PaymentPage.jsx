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
                  className={`radio-field
                  ${paymentMethod === "momo" ? "radio-active" : "radio-inactive"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                      className="radio-btn"
                    />
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1k5WbRLtFhBPCsYwJ19P4kMR_3SiNN1zwQboRpteTOA&s=10"
                      alt="MoMo"
                      className="brand-logo"
                    />
                    <div>
                      <p className="font-semibold text-sm">Ví Điện Tử MoMo</p>
                      <p className="text-xs text-gray-400">Thanh toán qua ứng dụng MoMo bằng mã QR</p>
                    </div>
                  </div>
                </label>
                <label
                  className={`radio-field
                  ${paymentMethod === "vnpay" ? "radio-active" : "radio-inactive"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="radio-btn"
                    />
                    <img
                      src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                      alt="VNPAY"
                      className="brand-logo"
                    />
                    <div>
                      <p className="font-semibold text-sm">Cổng thanh toán VNPAY</p>
                      <p className="text-xs text-gray-400">Hỗ trợ ứng dụng ngân hàng qua QR-PAY, thẻ ATM nội địa</p>
                    </div>
                  </div>
                </label>
                <label
                  className={`radio-field
                  ${paymentMethod === "stripe" ? "radio-active" : "radio-inactive"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="radio-btn"
                    />
                    <div className="brand-logo flex items-center justify-center border text-[#1a1f71]">
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
                      className="input-field"
                    />
                    {cardFormik.touched.cardNumber && cardFormik.errors.cardNumber && (
                      <span className="err-msg px-1">{cardFormik.errors.cardNumber}</span>
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
                        className="input-field"
                      />
                      {cardFormik.touched.cardExpiry && cardFormik.errors.cardExpiry && (
                        <span className="err-msg px-1">{cardFormik.errors.cardExpiry}</span>
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
                        className="input-field"
                      />
                      {cardFormik.touched.cardCvc && cardFormik.errors.cardCvc && (
                        <span className="err-msg px-1">{cardFormik.errors.cardCvc}</span>
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
              className="w-full mt-3 py-2 text-xs text-center cancel-icon block"
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
