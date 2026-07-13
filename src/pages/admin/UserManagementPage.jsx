import React, { useState, useRef, useMemo } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDeleteUser, useUsers } from "../../hooks/useUser";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import PagePagination from "../../components/PagePagination";
import SearchFilterBar from "../../components/SearchFilterBar";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import UserFormModal from "../../components/UserFormModal";

const UserManagementPage = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const debouncedQuery = useDebounce(query, 500);
  const pageSize = 20;

  const userSectionRef = useRef(null);

  const { data, isLoading, isError, error } = useUsers("GP01", page, pageSize, debouncedQuery);

  const users = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;
  const totalCount = data?.totalCount || 0;

  const deleteUser = useDeleteUser();

  const processedUsers = useMemo(() => {
    let result = [...users];
    if (roleFilter !== "All") {
      result = result.filter((u) => u.maLoaiNguoiDung === roleFilter);
    }
    return result;
  }, [users, roleFilter]);

  const userOptions = [
    { value: "All", label: "Tất cả người dùng" },
    { value: "KhachHang", label: "Khách hàng" },
    { value: "QuanTri", label: "Quản trị viên" },
  ];

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setPage(newPage);
    userSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
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
      {(isLoading || deleteUser.isPending) && <LoadingSpinner />}
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
          className="flex items-center gap-2 w-full sm:w-fit justify-center rounded-full bg-[#F0BB3B] hover:bg-[#dfac30] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#F0BB3B]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-user-plus text-xs"></i> Thêm người dùng
        </button>
      </div>
      <SearchFilterBar
        searchQuery={query}
        onSearchChange={(val) => {
          setQuery(val);
          setPage(1);
        }}
        filterValue={roleFilter}
        onFilterChange={(val) => {
          setRoleFilter(val);
          setPage(1);
        }}
        placeholder="Tìm kiếm tài khoản hoặc họ tên..."
        options={userOptions}
      />
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
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          user.maLoaiNguoiDung === "QuanTri"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-[#F0BB3B]/10 text-[#F0BB3B] border border-[#F0BB3B]/20"
                        }`}
                      >
                        {user.maLoaiNguoiDung === "QuanTri" ? "Quản trị" : "Khách hàng"}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="action-icon text-blue-700 hover:text-blue-500"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </button>
                      <button
                        onClick={() => setUserToDelete(user.taiKhoan)}
                        className="action-icon text-red-700 hover:text-red-500"
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
                            className="action-icon text-blue-700 hover:text-blue-500"
                          >
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                          <button
                            onClick={() => setUserToDelete(user.taiKhoan)}
                            className="action-icon text-red-700 hover:text-red-500"
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

          {/* pagination*/}
          {!isLoading && !isError && (
            <PagePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}

      {/* modal thêm/cập nhật người dùng */}
      <UserFormModal open={isModalOpen} editingUser={editingUser} users={users} onClose={handleCloseModal} />

      {/* delete user confirm modal */}
      <DeleteConfirmModal
        open={!!userToDelete}
        title="Xóa người dùng"
        message={userToDelete ? `Bạn có chắc muốn xóa tài khoản "${userToDelete}"?` : ""}
        loading={deleteUser.isPending}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagementPage;
