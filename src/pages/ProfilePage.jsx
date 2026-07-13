import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectorIsLoggedIn } from "../store/slices/authSlice";
import { useProfile } from "../hooks/useUser";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = () => {
  const isLoggedIn = useSelector(selectorIsLoggedIn);
  const { data: profile, isLoading } = useProfile(isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const avatar = profile?.hoTen[0].toUpperCase();

  return (
    <div className="min-h-screen wrapper pt-40 text-white">
      {isLoading && (
        <div className="modal-overlay">
          <LoadingSpinner />
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#2a1b35]/60 border border-[#442c54]/50 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#f0bb3b] shadow-[0_0_20px_rgba(240,187,59,0.3)] flex items-center justify-center text-gray-900 text-3xl font-bold shrink-0">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-wide">{profile?.hoTen}</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 text-gray-500 hover:text-[#f0bb3b] transition-all duration-200 cursor-pointer"
                  title="Chỉnh sửa thông tin"
                >
                  <i className="fa-regular fa-pen-to-square fa-lg"></i>
                </button>
              </div>
              <p className="text-gray-400 text-sm">@{profile?.taiKhoan}</p>
            </div>
            {profile?.maLoaiNguoiDung === "QuanTri" && (
              <Link to="/admin" className="shrink-0 flex items-center justify-center gap-2 accept-btn">
                <i className="fa-solid fa-gear"></i>
                <span>Trang quản trị</span>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#442c54]/30">
            <div>
              <p className="profile-page-label mb-1">Email</p>
              <p className="text-white text-sm font-medium">{profile?.email}</p>
            </div>
            <div>
              <p className="profile-page-label mb-1">Số điện thoại</p>
              <p className="text-white text-sm font-medium">{profile?.soDT}</p>
            </div>
            <div>
              <p className="profile-page-label mb-1">Mã Nhóm / Loại</p>
              <p className="text-white text-sm font-medium flex items-center gap-2">
                <span>{profile?.maNhom}</span>
                <span className="text-xs bg-purple-950/60 border border-[#442c54]/50 px-2 py-0.5 rounded text-gray-400">
                  {profile?.loaiNguoiDung?.tenLoai || "Khách hàng"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="profile-page-label mb-4">
            Lịch sử đặt vé{" "}
            <span className="text-[#f0bb3b] text-sm font-bold ml-1">({profile?.thongTinDatVe?.length || 0} vé)</span>
          </h2>
          <div className="space-y-4">
            {profile?.thongTinDatVe && profile.thongTinDatVe.length > 0 ? (
              profile.thongTinDatVe.map((ticket) => {
                const bookingDate = new Date(ticket.ngayDat).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={ticket.maVe}
                    className="bg-[#2a1b35]/60 border border-[#442c54]/50 backdrop-blur-lg rounded-2xl overflow-hidden hover:border-[#f0bb3b]/40 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] group"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 p-5">
                      <img
                        src={ticket.hinhAnh}
                        alt={ticket.tenPhim}
                        className="w-full sm:w-24 h-36 object-cover rounded-xl shrink-0 border border-[#442c54]/30"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300";
                        }}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h3 className="text-white font-bold text-xl group-hover:text-[#f0bb3b] transition-colors duration-200 leading-tight">
                              {ticket.tenPhim}
                            </h3>
                            <span className="text-[#f0bb3b] font-bold text-base bg-[#f0bb3b]/10 border border-[#f0bb3b]/20 px-3 py-1 rounded-lg">
                              {(ticket.giaVe * ticket.danhSachGhe.length).toLocaleString()} ₫
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-3 font-medium">
                            <span>🗓 {bookingDate}</span>
                            <span>⏱ {ticket.thoiLuongPhim} phút</span>
                            <span className="text-gray-500">Mã vé: #{ticket.maVe}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-purple-950/30">
                          {ticket.danhSachGhe && ticket.danhSachGhe.length > 0 && (
                            <>
                              <p className="text-gray-400 text-xs mb-2 flex items-center gap-1.5">
                                <span className="text-[#f0bb3b]">📍</span>
                                {ticket.danhSachGhe[0].tenHeThongRap} — {ticket.danhSachGhe[0].tenCumRap}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ticket.danhSachGhe.map((ghe, index) => (
                                  <span
                                    key={index}
                                    className="bg-black/30 border border-[#442c54]/50 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-lg hover:border-[#f0bb3b]/30 transition-colors"
                                  >
                                    {ghe.tenRap} - Ghế {ghe.tenGhe}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-[#2a1b35]/20 border border-[#442c54]/20 rounded-2xl">
                <p className="text-gray-400 text-sm">Bạn chưa thực hiện giao dịch đặt vé nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <EditProfileModal open={isModalOpen} profile={profile} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;
