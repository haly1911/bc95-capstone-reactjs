import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const AdminLayout = () => {
  const navLinkClassName = ({ isActive }) => {
    return isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 bg-[#f0bb3b]/10 border border-[#f0bb3b] text-[#f0bb3b] shadow-[0_0_15px_rgba(240,187,59,0.15)]"
      : "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-gray-400 hover:bg-[#342242]/60 hover:border-[#f0bb3b]/30 hover:text-white border border-transparent";
  };

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.refetchQueries({ queryKey: ["profile"] });
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex bg-[#160d1d]">
      <aside className="w-64 shrink-0 bg-[#2a1b35]/40 border-r border-[#442c54]/40 flex flex-col backdrop-blur-xl">
        <div className="px-6 py-6 border-b border-[#442c54]/30">
          <Link to="/admin" className="font-serif text-4xl">
            Lumière<span className="text-[#F0BB3B] drop-shadow-[0_0_10px_rgba(240,187,59,0.6)]">.</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="text-gray-300 text-xs font-bold uppercase tracking-widest px-4 mb-3 opacity-60">
            Quản lý nội dung
          </p>
          <NavLink to="/admin/users-management" className={navLinkClassName}>
            <div className="text-[#F0BB3B]">
              <i className="fa-solid fa-users"></i>
            </div>
            <span>Người dùng</span>
          </NavLink>
          <NavLink to="/admin/movies-management" className={navLinkClassName}>
            <div className="text-[#F0BB3B]">
              <i className="fa-solid fa-photo-film"></i>
            </div>
            <span>Phim</span>
          </NavLink>
          <NavLink to="/admin/showtimes" className={navLinkClassName}>
            <div className="text-[#F0BB3B]">
              <i className="fa-solid fa-calendar-days"></i>
            </div>
            <span>Lịch chiếu</span>
          </NavLink>
        </nav>

        <div className="px-4 pb-6 border-t border-[#442c54]/30 pt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold text-gray-300 bg-black/20 border border-[#442c54]/30 hover:border-[#f0bb3b]/40 hover:text-[#f0bb3b] transition-all duration-300"
          >
            <span>←</span>
            Về trang chủ
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#2a1b35]/20 border-b border-[#442c54]/30 px-8 py-5 flex items-center justify-between shrink-0 backdrop-blur-md">
          <div>
            <h1 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f0bb3b] shadow-[0_0_8px_#f0bb3b] animate-pulse"></span>
              Hệ thống quản trị
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-white text-sm font-bold tracking-wide">Admin User</p>
              <p className="text-[#f0bb3b] text-xs font-medium opacity-90">Quản trị viên</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#f0bb3b] shadow-[0_0_12px_rgba(240,187,59,0.3)] flex items-center justify-center text-gray-950 font-black text-sm shrink-0 border-2 border-[#160d1d]">
              A
            </div>

            <button onClick={handleLogout} className="header-btn">
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto bg-linear-to-b from-[#1c1125] to-[#110917]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
