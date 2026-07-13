import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAddUser, useUpdateUserByAdmin } from "../hooks/useUser";

const userValidationSchema = (editingUser, users = []) =>
  Yup.object().shape({
    taiKhoan: Yup.string()
      .required("Tài khoản không được để trống")
      .test("checkDuplicate", "Tài khoản này đã tồn tại trong hệ thống", (value) => {
        if (editingUser || !value) return true;
        return !users.some((user) => user.taiKhoan?.toLowerCase() === value.toLowerCase().trim());
      }),
    matKhau: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
    email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
    soDt: Yup.string()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]{10}$/, "Số điện thoại phải bao gồm đúng 10 chữ số"),
    hoTen: Yup.string().required("Họ tên không được để trống"),
    maLoaiNguoiDung: Yup.string().required("Loại người dùng không được để trống"),
  });

const UserFormModal = ({ open, editingUser, users, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const addUser = useAddUser();
  const updateUser = useUpdateUserByAdmin();

  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      hoTen: "",
      maLoaiNguoiDung: "KhachHang",
      maNhom: "GP01",
    },
    enableReinitialize: true,
    validationSchema: userValidationSchema(editingUser, users),
    onSubmit: async (values) => {
      const userData = { ...values, maNhom: "GP01" };
      if (editingUser) {
        updateUser.mutate(userData, {
          onSuccess: () => {
            toast.success("Cập nhật thành công!");
            handleCloseModal();
          },
          onError: (error) => {
            const errorMsg = error?.response?.data?.content || "Cập nhật thất bại!";
            toast.error(errorMsg);
          },
        });
      } else {
        addUser.mutate(userData, {
          onSuccess: () => {
            toast.success("Thêm người dùng mới thành công 🎉");
            handleCloseModal();
          },
          onError: (error) => {
            const errorMsg = error?.response?.data?.content || "Thêm người dùng thất bại!";
            toast.error(errorMsg);
          },
        });
      }
    },
  });

  // Cập nhật lại form values khi dữ liệu editingUser hoặc trạng thái open thay đổi
  useEffect(() => {
    if (open) {
      if (editingUser) {
        formik.setValues({
          taiKhoan: editingUser.taiKhoan || "",
          matKhau: editingUser.matKhau || "",
          hoTen: editingUser.hoTen || "",
          email: editingUser.email || "",
          soDt: editingUser.soDt || "",
          maLoaiNguoiDung: editingUser.maLoaiNguoiDung || "KhachHang",
          maNhom: "GP01",
        });
      } else {
        formik.resetForm({
          values: {
            taiKhoan: "",
            matKhau: "",
            hoTen: "",
            email: "",
            soDt: "",
            maLoaiNguoiDung: "KhachHang",
            maNhom: "GP01",
          },
        });
      }
    }
  }, [editingUser, open]);

  const handleCloseModal = () => {
    formik.resetForm();
    setShowPassword(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div onClick={handleCloseModal} className="modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="modal-bg overflow-hidden">
        <div className="modal-title">
          <h3 className="text-white text-lg font-bold">
            {editingUser ? "Cập nhật" : "Thêm"}{" "}
            <span className="text-[#F0BB3B]">người dùng {editingUser ? "" : "mới"}</span>
          </h3>
          <button onClick={handleCloseModal} className="cancel-icon">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-titles">Tài khoản</label>
              <input
                type="text"
                {...formik.getFieldProps("taiKhoan")}
                disabled={!!editingUser}
                placeholder="Nhập tài khoản"
                className={`w-full bg-transparent placeholder-gray-500 border border-[#442c54]/50 rounded-lg px-3 py-2.5 outline-none text-sm transition ${
                  editingUser
                    ? "opacity-50 cursor-not-allowed"
                    : "focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30"
                }`}
              />
              {formik.touched.taiKhoan && formik.errors.taiKhoan && (
                <p className="err-msg">{formik.errors.taiKhoan}</p>
              )}
            </div>
            <div>
              <label className="label-titles">Mật khẩu</label>
              <div className="input-field-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  {...formik.getFieldProps("matKhau")}
                  placeholder="••••••••••••"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
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
          </div>

          <div>
            <label className="label-titles">Họ tên</label>
            <input type="text" {...formik.getFieldProps("hoTen")} placeholder="Nhập họ tên" className="input-field" />
            {formik.touched.hoTen && formik.errors.hoTen && (
              <p className="err-msg">{formik.errors.hoTen}</p>
            )}
          </div>

          <div>
            <label className="label-titles">Email</label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="example@email.com"
              className="input-field"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="err-msg">{formik.errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-titles">Số điện thoại</label>
              <input type="text" {...formik.getFieldProps("soDt")} placeholder="0901234567" className="input-field" />
              {formik.touched.soDt && formik.errors.soDt && (
                <p className="err-msg">{formik.errors.soDt}</p>
              )}
            </div>
            <div>
              <label className="label-titles">Loại tài khoản</label>
              <select {...formik.getFieldProps("maLoaiNguoiDung")} className="input-field">
                <option value="KhachHang" className="bg-[#2A0617]">
                  Khách hàng
                </option>
                <option value="QuanTri" className="bg-[#2A0617]">
                  Quản trị
                </option>
              </select>
              {formik.touched.maLoaiNguoiDung && formik.errors.maLoaiNguoiDung && (
                <p className="err-msg">{formik.errors.maLoaiNguoiDung}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#442c54]/50">
            <button type="button" onClick={handleCloseModal} className="cancel-btn">
              Huỷ
            </button>
            <button
              type="submit"
              disabled={!formik.isValid || addUser.isPending || updateUser.isPending}
              className="accept-btn text-sm"
            >
              {addUser.isPending || updateUser.isPending
                ? "Đang xử lý..."
                : editingUser
                  ? "Lưu thay đổi"
                  : "Xác nhận thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
