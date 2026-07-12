import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { formatDateForInput, formatDateForSubmit } from "../utils/date";

const addMovieValidationSchema = Yup.object({
  tenPhim: Yup.string().required("Tên phim không được để trống"),
  trailer: Yup.string().url("Trailer phải là đường dẫn URL hợp lệ").required("Trailer không được để trống"),
  moTa: Yup.string().required("Mô tả không được để trống"),
  ngayKhoiChieu: Yup.string().required("Ngày khởi chiếu không được để trống"),
  danhGia: Yup.number().min(0, "Tối thiểu là 0").max(10, "Tối đa là 10").required("Đánh giá không được để trống"),
  hinhAnh: Yup.mixed().required("Vui lòng chọn hình ảnh"),
});

const updateMovieValidationSchema = Yup.object({
  tenPhim: Yup.string().required("Tên phim không được để trống"),
  trailer: Yup.string().url("Trailer phải là đường dẫn URL hợp lệ").required("Trailer không được để trống"),
  moTa: Yup.string().required("Mô tả không được để trống"),
  ngayKhoiChieu: Yup.string().required("Ngày khởi chiếu không được để trống"),
  danhGia: Yup.number().min(0, "Tối thiểu là 0").max(10, "Tối đa là 10").required("Đánh giá không được để trống"),
  hinhAnh: Yup.mixed().nullable(),
});

const MovieFormModal = ({ isOpen, onClose, editingMovie, addMovieMutation, updateMovieMutation }) => {
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      tenPhim: "",
      trailer: "",
      moTa: "",
      ngayKhoiChieu: "",
      sapChieu: false,
      dangChieu: false,
      hot: false,
      danhGia: "",
      hinhAnh: null,
    },
    validationSchema: editingMovie ? updateMovieValidationSchema : addMovieValidationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("sapChieu", values.sapChieu);
      formData.append("dangChieu", values.dangChieu);
      formData.append("hot", values.hot);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", "GP01");
      formData.append("ngayKhoiChieu", formatDateForSubmit(values.ngayKhoiChieu));

      if (editingMovie) {
        formData.append("maPhim", editingMovie.maPhim);
      }
      if (values.hinhAnh instanceof File) {
        formData.append("hinhAnh", values.hinhAnh);
      }

      if (editingMovie) {
        updateMovieMutation.mutate(formData, {
          onSuccess: () => {
            toast.success("Cập nhật thông tin phim thành công!");
            onClose();
          },
          onError: (err) => {
            toast.error(err.response?.data?.content ?? "Có lỗi từ máy chủ, vui lòng thử lại.");
          },
        });
      } else {
        addMovieMutation.mutate(formData, {
          onSuccess: () => {
            toast.success("Thêm phim mới thành công 🎉");
            onClose();
          },
          onError: (err) => {
            console.error("Update Error:", err.response?.data);
            toast.error(
              err.response?.data?.content || err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
            );
          },
        });
      }
    },
  });
  useEffect(() => {
    if (isOpen) {
      if (editingMovie) {
        const formattedDate = formatDateForInput(editingMovie.ngayKhoiChieu);
        formik.setValues({
          tenPhim: editingMovie.tenPhim || "",
          trailer: editingMovie.trailer || "",
          moTa: editingMovie.moTa || "",
          ngayKhoiChieu: formattedDate,
          sapChieu: !!editingMovie.sapChieu,
          dangChieu: !!editingMovie.dangChieu,
          hot: !!editingMovie.hot,
          danhGia: editingMovie.danhGia || 5,
          hinhAnh: null,
        });
        setImagePreview(editingMovie.hinhAnh || "");
      } else {
        formik.resetForm();
        setImagePreview("");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, editingMovie]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formik.setFieldValue("hinhAnh", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("hinhAnh", null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isLoading = addMovieMutation.isPending || updateMovieMutation.isPending;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-xs overflow-y-auto py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-linear-to-b from-[#16091F] to-[#2A0617] rounded-2xl border border-[#442c54]/50 shadow-2xl overflow-hidden my-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#442c54]/50 bg-black/30">
          <h3 className="text-white text-lg font-bold">
            {editingMovie ? "Cập nhật" : "Thêm"} <span className="text-[#F0BB3B]">phim điện ảnh</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer">
            &times;
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1">Tên phim</label>
              <input
                type="text"
                {...formik.getFieldProps("tenPhim")}
                placeholder="Nhập tên bộ phim"
                className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B]"
              />
              {formik.touched.tenPhim && formik.errors.tenPhim && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.tenPhim}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1">Trailer URL (Youtube)</label>
              <input
                type="text"
                {...formik.getFieldProps("trailer")}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B]"
              />
              {formik.touched.trailer && formik.errors.trailer && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.trailer}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1">Mô tả nội dung phim</label>
            <textarea
              rows="3"
              {...formik.getFieldProps("moTa")}
              placeholder="Nội dung tóm tắt cốt truyện cốt phim..."
              className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B] resize-none"
            />
            {formik.touched.moTa && formik.errors.moTa && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.moTa}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1">Ngày khởi chiếu</label>
              <input
                type="date"
                {...formik.getFieldProps("ngayKhoiChieu")}
                className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B] text-gray-300"
              />
              {formik.touched.ngayKhoiChieu && formik.errors.ngayKhoiChieu && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.ngayKhoiChieu}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1">Đánh giá điểm số (0 - 10)</label>
              <input
                type="number"
                {...formik.getFieldProps("danhGia")}
                className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0BB3B]"
              />
              {formik.touched.danhGia && formik.errors.danhGia && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.danhGia}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">Trạng thái hiển thị (Tags)</label>
            <div className="flex gap-6 py-2.5 px-3 bg-black/20 border border-[#442c54]/30 rounded-lg">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formik.values.dangChieu}
                  onChange={(e) => formik.setFieldValue("dangChieu", e.target.checked)}
                  className="rounded text-[#F0BB3B] focus:ring-0 bg-transparent border-gray-700 w-4 h-4"
                />{" "}
                Đang chiếu
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formik.values.sapChieu}
                  onChange={(e) => formik.setFieldValue("sapChieu", e.target.checked)}
                  className="rounded text-[#F0BB3B] focus:ring-0 bg-transparent border-gray-700 w-4 h-4"
                />{" "}
                Sắp chiếu
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formik.values.hot}
                  onChange={(e) => formik.setFieldValue("hot", e.target.checked)}
                  className="rounded text-[#F0BB3B] focus:ring-0 bg-transparent border-gray-700 w-4 h-4"
                />{" "}
                Phim HOT
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1">Hình ảnh Poster phim</label>
            <div className="flex items-center gap-4 p-2 bg-black/10 border border-[#442c54]/30 rounded-lg">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-950/40 file:text-gray-300 hover:file:bg-purple-900/50 cursor-pointer flex-1"
              />
              {imagePreview && (
                <div className="relative group w-12 h-16 border border-[#F0BB3B]/40 rounded shadow-md overflow-visible bg-black">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#F0BB3B] text-black transition hover:scale-110 active:scale-95 cursor-pointer z-10"
                    title="Xóa hình ảnh vừa chọn"
                  >
                    <i className="fa-solid fa-xmark fa-2xs"></i>
                  </button>
                </div>
              )}
            </div>
            {formik.touched.hinhAnh && formik.errors.hinhAnh && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.hinhAnh}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#442c54]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-semibold text-gray-400 hover:text-white border border-[#442c54]/50 hover:border-[#F0BB3B]/50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!formik.isValid || isLoading}
              className="bg-[#F0BB3B] hover:bg-[#dfac30] disabled:bg-yellow-800/50 disabled:cursor-not-allowed text-gray-950 font-bold px-6 py-2 rounded-full text-sm shadow-lg cursor-pointer"
            >
              {isLoading ? "Đang xử lý..." : editingMovie ? "Lưu thay đổi" : "Thêm phim mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieFormModal;
