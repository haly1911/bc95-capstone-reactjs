import React, { useState, useRef, useMemo } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAddUser, useDeleteUser, useUpdateUserByAdmin, useUsers } from "../../hooks/useUser";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "react-toastify";

const validationSchema = (editingUser, users) =>
  Yup.object().shape({
    taiKhoan: Yup.string()
      .required("Tài khoản không được để trống")
      .test("checkDuplicate", "Tài khoản này đã tồn tại trong hệ thống", (value) => {
        if (editingUser) return true;
        return !users.some((user) => user.taiKhoan.toLowerCase() === value.toLowerCase().trim());
      }),
    matKhau: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
    email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
    soDt: Yup.string()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]{10}$/, "Số điện thoại phải bao gồm đúng 10 chữ số"),
    hoTen: Yup.string().required("Họ tên không được để trống"),
    maLoaiNguoiDung: Yup.string().required("Loại người dùng không được để trống"),
  });

const UserManagementPage = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const debouncedQuery = useDebounce(query, 500);
  const pageSize = 20;

  const userSectionRef = useRef(null);

  const { data, isLoading, isError, error } = useUsers("GP01", page, pageSize, debouncedQuery);

  const users = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;
  const totalCount = data?.totalCount || 0;

  const addUser = useAddUser();
  const updateUser = useUpdateUserByAdmin();
  const deleteUser = useDeleteUser();

  const processedUsers = useMemo(() => {
    let result = [...users];
    if (roleFilter !== "All") {
      result = result.filter((u) => u.maLoaiNguoiDung === roleFilter);
    }
    return result;
  }, [users, roleFilter]);

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
    validationSchema: validationSchema(editingUser, users),
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

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setPage(newPage);
    userSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCloseModal = () => {
    formik.resetForm();
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      formik.setValues({
        taiKhoan: user.taiKhoan || "",
        matKhau: user.matKhau || "",
        hoTen: user.hoTen || "",
        email: user.email || "",
        soDt: user.soDt || "",
        maLoaiNguoiDung: user.maLoaiNguoiDung || "KhachHang",
      });
    } else {
      setEditingUser(null);
      formik.resetForm({
        values: {
          taiKhoan: "",
          matKhau: "",
          hoTen: "",
          email: "",
          soDt: "",
          maLoaiNguoiDung: "KhachHang",
        },
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete, {
      onSuccess: () => {
        toast.success(`Đã xóa tài khoản ${userToDelete} thành công!`);
        setUserToDelete(null);
      },
      onError: (error) => {
        const errorMsg = error?.response?.data?.content || "Xóa người dùng thất bại!";
        toast.error(errorMsg);
        setUserToDelete(null);
      },
    });
  };

  return (
    <div ref={userSectionRef} className="flex min-h-screen wrapper flex-col">
      {(isLoading || addUser.isPending || updateUser.isPending || deleteUser.isPending) && <LoadingSpinner />}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">
            Danh Sách <span className="text-[#F0BB3B]">Người Dùng</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Hiển thị <span className="text-[#F0BB3B] font-medium">{pageSize}</span> / {totalCount} người dùng
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-full bg-[#F0BB3B] hover:bg-[#dfac30] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#F0BB3B]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-user-plus text-xs"></i> Thêm người dùng
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-6 w-full max-w-4xl">
        {/* Ô Tìm kiếm */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm opacity-50">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm tài khoản hoặc họ tên..."
            className="h-11 w-full rounded-xl border border-[#442c54]/50 bg-[#16091F] pl-11 pr-4 text-sm outline-none transition focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30"
          />
        </div>
        <div className="relative flex-1 sm:flex-none">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full sm:w-40 rounded-xl border border-[#442c54]/50 bg-[#16091F] pl-3 pr-8 text-xs font-medium text-gray-300 outline-none transition focus:border-[#F0BB3B] cursor-pointer appearance-none"
          >
            <option value="All" className="bg-[#16091F]">
              Tất cả người dùng
            </option>
            <option value="KhachHang" className="bg-[#16091F]">
              Khách hàng
            </option>
            <option value="QuanTri" className="bg-[#16091F]">
              Quản trị viên
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
            <i className="fa-solid fa-filter"></i>
          </div>
        </div>
      </div>
      {isError && (
        <div className="text-center py-20 bg-black/30 rounded-2xl border border-red-500/20">
          <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
          <p className="text-gray-500 text-sm">{error?.message || "Không thể tải danh sách"}</p>
        </div>
      )}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {processedUsers.length === 0 ? (
              <div className="text-center sm:col-span-2 py-10 text-gray-500 bg-black/40 rounded-xl border border-gray-800">
                Không tìm thấy người dùng phù hợp
              </div>
            ) : (
              processedUsers.map((user) => (
                <div
                  key={user.taiKhoan}
                  className="bg-[#2A0617]/40 border border-purple-950/50 text-gray-400 text-xs p-6 rounded-lg hover:border-[#f0bb3b]/50 hover:text-white transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center justify-center gap-3 h-full">
                      <h4 className="text-base font-bold">{user.hoTen}</h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          user.maLoaiNguoiDung === "QuanTri"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-[#F0BB3B]/10 text-[#F0BB3B] border border-[#F0BB3B]/20"
                        }`}
                      >
                        {user.maLoaiNguoiDung === "QuanTri" ? "Quản trị" : "Khách hàng"}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <button onClick={() => handleOpenModal(user)} className="text-blue-700 hover:text-blue-500">
                        <i className="fa-solid fa-pencil"></i>
                      </button>
                      <button
                        onClick={() => setUserToDelete(user.taiKhoan)}
                        className="text-red-700 hover:text-red-500"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1 grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/50">
                    <div className="col-span-2">
                      <span className="font-medium text-gray-500">Tài khoản: </span>
                      <span className="text-gray-200">{user.taiKhoan}</span>
                    </div>
                    <div className="col-span-2 truncate">
                      <span className="font-medium text-gray-500">Email: </span>
                      <span className="text-gray-200">{user.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-500">SĐT: </span>
                      <span className="text-gray-200">{user.soDt}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* 2. GIAO DIỆN TABLE CHO DESKTOP */}
          <div className="hidden lg:block overflow-x-auto bg-[#16091F] border border-[#442c54]/50 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-gray-300 rounded-xl transition-all duration-300">
            <table className="min-w-full text-sm text-left">
              <thead className="font-semibold border-b border-[#442c54]/50">
                <tr>
                  <th className="pl-6 py-4">Tài khoản</th>
                  <th className="py-4">Họ tên</th>
                  <th className="py-4">Email</th>
                  <th className="py-4 hidden lg:table-cell">Số điện thoại</th>
                  <th className="py-4">Loại tài khoản</th>
                  <th className="py-4 text-center">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/60 bg-[#1E1326]">
                {processedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      Không tìm thấy người dùng phù hợp.
                    </td>
                  </tr>
                ) : (
                  processedUsers.map((user) => (
                    <tr key={user.taiKhoan} className="transition hover:bg-[#2A0617]/50">
                      <td className="py-4 pl-6 font-medium text-gray-300">{user.taiKhoan}</td>
                      <td className="py-4 font-bold">{user.hoTen}</td>
                      <td className="py-4 text-gray-300">{user.email}</td>
                      <td className="py-4 text-gray-300 hidden lg:table-cell">{user.soDt}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.maLoaiNguoiDung === "QuanTri"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-[#F0BB3B]/10 text-[#F0BB3B] border-[#F0BB3B]/20"
                          }`}
                        >
                          {user.maLoaiNguoiDung === "QuanTri" ? "Quản trị" : "Khách hàng"}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="text-blue-700 hover:text-blue-500 transition hover:scale-110 cursor-pointer"
                          >
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                          <button
                            onClick={() => setUserToDelete(user.taiKhoan)}
                            className="text-red-700 hover:text-red-500 transition hover:scale-110 cursor-pointer"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 3. PAGINATION CONTROL (Giống MovieListPage) */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="grid h-10 w-10 place-items-center rounded-full border transition border-gray-800 bg-black/20 disabled:opacity-40 disabled:pointer-events-none enabled:hover:border-[#F0BB3B] enabled:hover:text-[#F0BB3B] enabled:cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const active = n === currentPage;
                return (
                  <button
                    key={n}
                    onClick={() => handlePageChange(n)}
                    className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-bold transition cursor-pointer ${
                      active
                        ? "border-[#F0BB3B] bg-[#F0BB3B] text-black shadow-[0_0_15px_rgba(240,187,59,0.4)]"
                        : "border-gray-800 bg-black/20 text-gray-400 hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="grid h-10 w-10 place-items-center rounded-full border transition border-gray-800 bg-black/20 disabled:opacity-40 disabled:pointer-events-none enabled:hover:border-[#F0BB3B] enabled:hover:text-[#F0BB3B] enabled:cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL THÊM NGƯỜI DÙNG */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-linear-120 from-[#16091F] to-[#2A0617] rounded-2xl border border-[#442c54]/50 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#442c54]/50 bg-black/30">
              <h3 className="text-white text-lg font-bold">
                {editingUser ? "Cập nhật" : "Thêm"}{" "}
                <span className="text-[#F0BB3B]">người dùng {editingUser ? "" : "mới"}</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={formik.handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Tài khoản</label>
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
                    <p className="text-red-400 text-xs mt-1">{formik.errors.taiKhoan}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Mật khẩu</label>
                  <div className="flex items-center border border-[#442c54]/50 rounded-lg px-3 py-2.5 focus-within:border-[#F0BB3B] focus-within:ring-1 focus-within:ring-[#F0BB3B]/30 transition">
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
                    <p className="text-red-400 text-xs mt-1">{formik.errors.matKhau}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Họ tên</label>
                <input
                  type="text"
                  {...formik.getFieldProps("hoTen")}
                  placeholder="Nhập họ tên"
                  className="w-full bg-transparent placeholder-gray-500 border border-[#442c54]/50 rounded-lg px-3 py-2.5 outline-none focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30 text-sm transition"
                />
                {formik.touched.hoTen && formik.errors.hoTen && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.hoTen}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="example@email.com"
                  className="w-full bg-transparent placeholder-gray-500 border border-[#442c54]/50 rounded-lg px-3 py-2.5 outline-none focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30 text-sm transition"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Số điện thoại</label>
                  <input
                    type="text"
                    {...formik.getFieldProps("soDt")}
                    placeholder="0901234567"
                    className="w-full bg-transparent placeholder-gray-500 border border-[#442c54]/50 rounded-lg px-3 py-2.5 outline-none focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30 text-sm transition"
                  />
                  {formik.touched.soDt && formik.errors.soDt && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.soDt}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Loại tài khoản</label>
                  <select
                    {...formik.getFieldProps("maLoaiNguoiDung")}
                    className="w-full bg-transparent border border-[#442c54]/50 rounded-lg px-3 py-2.5 outline-none focus:border-[#F0BB3B] focus:ring-1 focus:ring-[#F0BB3B]/30 text-sm transition cursor-pointer"
                  >
                    <option value="KhachHang" className="bg-[#2A0617]">
                      Khách hàng
                    </option>
                    <option value="QuanTri" className="bg-[#2A0617]">
                      Quản trị
                    </option>
                  </select>
                  {formik.touched.maLoaiNguoiDung && formik.errors.maLoaiNguoiDung && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.maLoaiNguoiDung}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#442c54]/50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-400 hover:text-white border border-[#442c54]/50 hover:border-[#F0BB3B]/50 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formik.isValid || addUser.isPending || updateUser.isPending}
                  className="bg-[#F0BB3B] hover:bg-[#dfac30] disabled:bg-yellow-800/50 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-950 font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-[#F0BB3B]/10 cursor-pointer"
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
      )}

      {/* delete user confirm modal */}
      {!!userToDelete && (
        <div
          onClick={() => setUserToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-linear-to-br from-[#16091F] to-[#2A0617] rounded-2xl border border-red-950/40 w-full max-w-md shadow-2xl p-6 text-center transition-all animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-2xl mb-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3 className="text-white text-xl font-black mb-2">Xác nhận xóa tài khoản?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản{" "}
              <span className="text-[#F0BB3B] font-mono font-bold">{userToDelete}</span> khỏi hệ thống? Hành động này
              không thể hoàn tác
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
