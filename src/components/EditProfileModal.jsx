import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUpdateUser } from "../hooks/useUser";

const profileValidationSchema = Yup.object().shape({
  hoTen: Yup.string().required("Họ tên không được để trống"),
  email: Yup.string().email("Email không đúng định dạng").required("Email không được để trống"),
  soDT: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải bao gồm đúng 10 chữ số")
    .required("Số điện thoại không được để trống"),
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
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative modal-bg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#442c54]/50 pb-4 mb-5">
          <h3 className="text-xl font-bold tracking-wide">
            Chỉnh sửa <span className="text-[#f0bb3b]">Hồ sơ</span>
          </h3>
          <button onClick={onClose} className="cancel-icon">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="label-titles uppercase tracking-wider">Tài khoản</label>
            <input
              type="text"
              disabled
              {...formik.getFieldProps("taiKhoan")}
              className="input-field cursor-not-allowed opacity-60"
            />
          </div>
          <div>
            <label className="label-titles uppercase tracking-wider">Họ và tên</label>
            <input type="text" {...formik.getFieldProps("hoTen")} className="input-field" />
            {formik.touched.hoTen && formik.errors.hoTen && <p className="err-msg">{formik.errors.hoTen}</p>}
          </div>
          <div>
            <label className="label-titles uppercase tracking-wider">Email</label>
            <input type="email" {...formik.getFieldProps("email")} className="input-field" />
            {formik.touched.email && formik.errors.email && <p className="err-msg">{formik.errors.email}</p>}
          </div>
          <div>
            <label className="label-titles uppercase tracking-wider">Số điện thoại</label>
            <input type="text" {...formik.getFieldProps("soDT")} className="input-field" />
            {formik.touched.soDT && formik.errors.soDT && <p className="err-msg">{formik.errors.soDT}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-titles uppercase tracking-wider">Mã nhóm</label>
              <input
                type="text"
                disabled
                {...formik.getFieldProps("maNhom")}
                className="input-field cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="label-titles uppercase tracking-wider">Loại tài khoản</label>
              <input
                type="text"
                disabled
                value={profile?.loaiNguoiDung?.tenLoai || "Khách hàng"}
                className="input-field cursor-not-allowed opacity-60"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#442c54]/40 mt-6">
            <button type="button" onClick={onClose} className="cancel-btn">
              Huỷ bỏ
            </button>
            <button type="submit" disabled={updateProfile.isPending} className="accept-btn text-sm">
              {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
