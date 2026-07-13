import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { login } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const loginSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string().required("Mật khẩu không được để trống"),
});

const registerSchema = Yup.object().shape({
  hoTen: Yup.string().required("Họ tên không được để trống"),
  soDt: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(/^\d{10}$/, "Số điện thoại phải là số và có đúng 10 chữ số"),
  email: Yup.string().required("Email không được để trống").email("Email không hợp lệ"),
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string().required("Mật khẩu không được để trống"),
});

const LoginPage = () => {
  const [apiError, setApiError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      hoTen: "",
      soDt: "",
      email: "",
      taiKhoan: "",
      matKhau: "",
    },
    validationSchema: isLogin ? loginSchema : registerSchema,
    onSubmit: async (values) => {
      setApiError("");
      try {
        if (isLogin) {
          const response = await authApi.login({
            taiKhoan: values.taiKhoan,
            matKhau: values.matKhau,
          });
          dispatch(login(response.data.content));
          toast.success("👋 Chào mừng bạn trở lại với Lumière!");
          const redirectPath = location.state?.from;
          const pendingBookingData = location.state?.bookingData;

          if (redirectPath === "/payment" && pendingBookingData) {
            navigate("/payment", { state: pendingBookingData, replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          const registerData = {
            taiKhoan: values.taiKhoan,
            matKhau: values.matKhau,
            hoTen: values.hoTen,
            soDt: values.soDt,
            email: values.email,
            maNhom: "GP01",
          };
          await authApi.register(registerData);
          toast.success("🎉 Đăng ký thành công! Hãy đăng nhập tài khoản mới.");
          setIsLogin(true);
          formik.resetForm();
        }
      } catch (error) {
        const errorMsg = error.response?.data?.content || "Có lỗi xảy ra, vui lòng thử lại!";
        toast.error(`❌ ${errorMsg}`);
        setApiError(errorMsg);
      }
    },
  });

  const handleTabChange = (status) => {
    setIsLogin(status);
    setApiError("");
    formik.resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <aside className="hidden lg:flex relative w-full min-h-screen flex-col justify-between p-6 text-white box-border">
        <img
          src="/login-background.jpg"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          alt="background"
        />
        <div className="absolute inset-0 bg-violet-900/30 -z-10" />
        <a href="" className="font-serif text-5xl tracking-wide block">
          Lumière<span className="text-[#F0BB3B]">.</span>
        </a>
        <div className="my-auto py-12">
          <h2 className="text-4xl pb-4 font-bold leading-tight">
            Trải nghiệm điện ảnh
            <br />
            <span className="text-[#F0BB3B]">đẳng cấp</span> mỗi ngày
          </h2>
          <p className="italic text-md max-w-md opacity-90">
            Đăng nhập để tích điểm, nhận ưu đãi độc quyền và đặt chỗ ngồi yêu thích nhanh chóng tại hơn 40 cụm rạp
          </p>
        </div>
        <p className="text-sm opacity-70">© Lumière Cinemas</p>
      </aside>
      <div className="wrapper max-w-md w-full mx-auto p-6 flex flex-col justify-center gap-6 text-white">
        <div className="space-y-2">
          <button
            onClick={() => handleTabChange(true)}
            className="lg:hidden font-serif text-5xl tracking-wide block mb-6 text-left cursor-pointer"
          >
            Lumière<span className="text-[#F0BB3B]">.</span>
          </button>
          <h1 className="text-3xl font-bold tracking-tight">{isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h1>
          <p className="text-sm opacity-75">
            {isLogin
              ? "Đăng nhập để tiếp tục đặt vé và tận hưởng ưu đãi"
              : "Tham gia Lumière để nhận ngay 50 điểm thưởng"}
          </p>
        </div>
        <div className="p-1 rounded-full bg-white/10 border border-white/10 grid grid-cols-2 text-sm font-medium">
          <button
            type="button"
            onClick={() => handleTabChange(true)}
            className={`py-2.5 rounded-full cursor-pointer transition-all font-semibold ${
              isLogin ? "bg-[#F0BB3B] text-black shadow-md" : "text-white/80 hover:text-white"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => handleTabChange(false)}
            className={`py-2.5 rounded-full cursor-pointer transition-all font-semibold ${
              !isLogin ? "bg-[#F0BB3B] text-black shadow-md" : "text-white/80 hover:text-white"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {apiError && (
            <div className="bg-red-500 text-white text-sm font-medium px-4 py-3 rounded mb-4">{apiError}</div>
          )}
          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="label-titles tracking-wide uppercase px-1">Họ và tên</label>
                <div className="input-field-with-icon">
                  <div className="opacity-50 flex items-center">
                    <i className="fa-regular fa-user fa-sm"></i>
                  </div>
                  <input
                    type="text"
                    {...formik.getFieldProps("hoTen")}
                    placeholder="Nguyễn Văn A"
                    className="login-input-field"
                  />
                </div>
                {formik.touched.hoTen && formik.errors.hoTen && (
                  <p className="err-msg">{formik.errors.hoTen}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="label-titles tracking-wide uppercase px-1">Số điện thoại</label>
                <div className="input-field-with-icon">
                  <div className="opacity-50 flex items-center">
                    <i className="fa-solid fa-phone fa-sm"></i>
                  </div>
                  <input
                    type="text"
                    {...formik.getFieldProps("soDt")}
                    placeholder="0909123123"
                    className="login-input-field"
                  />
                </div>
                {formik.touched.soDt && formik.errors.soDt && (
                  <p className="err-msg">{formik.errors.soDt}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="label-titles tracking-wide uppercase px-1">Email</label>
                <div className="input-field-with-icon">
                  <div className="opacity-50 flex items-center">
                    <i className="fa-regular fa-envelope fa-sm"></i>
                  </div>
                  <input
                    type="email"
                    {...formik.getFieldProps("email")}
                    placeholder="nguyenvana@email.com"
                    className="login-input-field"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="err-msg">{formik.errors.email}</p>
                )}
              </div>
            </>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="label-titles tracking-wide uppercase px-1">Tài khoản</label>
            <div className="input-field-with-icon">
              <div className="opacity-50 flex items-center">
                <i className="fa-regular fa-envelope fa-sm"></i>
              </div>
              <input
                type="text"
                {...formik.getFieldProps("taiKhoan")}
                placeholder="nguyenvana"
                className="login-input-field"
              />
            </div>
            {formik.touched.taiKhoan && formik.errors.taiKhoan && (
              <p className="err-msg">{formik.errors.taiKhoan}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-titles tracking-wide uppercase px-1">Mật khẩu</label>
            <div className="input-field-with-icon">
              <div className="opacity-50 flex items-center">
                <i className="fa-solid fa-key fa-sm"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("matKhau")}
                placeholder="••••••••••••••••"
                className="login-input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="opacity-50 hover:opacity-100 cursor-pointer transition-all flex items-center justify-center"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} fa-sm`}></i>
              </button>
            </div>
            {formik.touched.matKhau && formik.errors.matKhau && (
              <p className="err-msg">{formik.errors.matKhau}</p>
            )}
          </div>
          <button type="submit" className="w-full mt-2 accept-btn">
            {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
