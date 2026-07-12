import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUpdateUser } from "../hooks/useUser";

const profileValidationSchema = Yup.object().shape({
  hoTen: Yup.string().required("Họ tên không được để trống *"),
  email: Yup.string().email("Email không đúng định dạng").required("Email không được để trống *"),
  soDT: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải bao gồm đúng 10 chữ số")
    .required("Số điện thoại không được để trống *"),
});

const EditProfileModal = ({ open, profile, onClose }) => {
  const updateProfile = useUpdateUser();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taiKhoan: profile?.taiKhoan || "",
      hoTen: profile?.hoTen || "",
      email: profile?.email || "",
      soDT: profile?.soDT || "",
      maNhom: profile?.maNhom || "",
      maLoaiNguoiDung: profile?.maLoaiNguoiDung || "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      updateProfile.mutate(values, {
        onSuccess: () => {
          toast.success("Cập nhật thông tin thành công!");
          onClose();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.content || "Cập nhật thất bại!");
        },
      });
    },
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-linear-120 from-[#16091F] to-[#2A0617] rounded-2xl border border-[#442c54] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 text-white max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#442c54]/50 pb-4 mb-5">
          <h3 className="text-xl font-bold tracking-wide">
            Chỉnh sửa <span className="text-[#f0bb3b]">Hồ sơ</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">
              Tài khoản
            </label>
            <input
              type="text"
              disabled
              {...formik.getFieldProps("taiKhoan")}
              className="w-full bg-[#2a1b35]/40 border border-[#442c54]/40 text-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">
              Họ và tên
            </label>
            <input
              type="text"
              {...formik.getFieldProps("hoTen")}
              className={`w-full bg-[#2a1b35]/80 border ${
                formik.touched.hoTen && formik.errors.hoTen ? "border-red-500" : "border-[#442c54]"
              } focus:border-[#f0bb3b] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors`}
            />
            {formik.touched.hoTen && formik.errors.hoTen && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formik.errors.hoTen}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">Email</label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              className={`w-full bg-[#2a1b35]/80 border ${
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-[#442c54]"
              } focus:border-[#f0bb3b] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">
              Số điện thoại
            </label>
            <input
              type="text"
              {...formik.getFieldProps("soDT")}
              className={`w-full bg-[#2a1b35]/80 border ${
                formik.touched.soDT && formik.errors.soDT ? "border-red-500" : "border-[#442c54]"
              } focus:border-[#f0bb3b] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors`}
            />
            {formik.touched.soDT && formik.errors.soDT && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formik.errors.soDT}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">
                Mã nhóm
              </label>
              <input
                type="text"
                disabled
                {...formik.getFieldProps("maNhom")}
                className="w-full bg-[#2a1b35]/40 border border-[#442c54]/40 text-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">
                Loại tài khoản
              </label>
              <input
                type="text"
                disabled
                value={profile?.loaiNguoiDung?.tenLoai || "Khách hàng"}
                className="w-full bg-[#2a1b35]/40 border border-[#442c54]/40 text-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed opacity-60"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#442c54]/40 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#442c54] text-sm text-gray-400 hover:text-white hover:bg-[#2a1b35] transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-5 py-2.5 rounded-xl bg-[#f0bb3b] hover:bg-[#f0bb3b]/90 text-gray-900 font-bold text-sm transition-all shadow-[0_4px_15px_rgba(240,187,59,0.2)] cursor-pointer disabled:opacity-50"
            >
              {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
