import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, selectorIsLoggedIn, selectorUser } from "../store/slices/authSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector(selectorIsLoggedIn);
  const user = useSelector(selectorUser);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-6 border-b border-white/10 bg-[#16091F]">
      <div>
        <Link to="/" className="font-serif text-3xl tracking-wide">
          Lumière<span className="text-[#F0BB3B]">.</span>
        </Link>
      </div>
      <nav className="hidden sm:block">
        <ul className="flex items-center gap-9">
          <li>
            <Link to="/movie" className="nav-titles">
              Lịch chiếu
            </Link>
          </li>
          <li>
            <Link to="#" className="nav-titles">
              Cụm rạp
            </Link>
          </li>
          <li>
            <Link to="#" className="nav-titles">
              Ưu Đãi
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-300">
              Xin chào, <span className="text-yellow-400 font-medium">{user?.hoTen}</span>
            </span>
            <button onClick={handleLogout} className="header-btn hidden sm:block space-x-2">
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login" className="header-btn hidden sm:block space-x-2">
            <i className="fa-regular fa-user"></i>
            <span>Đăng nhập</span>
          </Link>
        )}
        <div className="block sm:hidden">
          <button className="header-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 z-50 sm:hidden">
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-2 right-2 z-50 bg-[#0b0a14] sm:hidden border border-white/10 p-8 rounded-3xl"
          >
            <nav>
              <ul className="flex flex-col gap-6 text-sm">
                <li>
                  <Link className="nav-titles block" to="/movie" onClick={() => setIsMenuOpen(false)}>
                    Lịch chiếu
                  </Link>
                </li>
                <li>
                  <Link className="nav-titles block" to="#" onClick={() => setIsMenuOpen(false)}>
                    Cụm rạp
                  </Link>
                </li>
                <li>
                  <Link className="nav-titles block" to="#" onClick={() => setIsMenuOpen(false)}>
                    Ưu Đãi
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="mt-6 pt-4 border-t border-white/10">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="header-btn">
                  Đăng xuất
                </button>
              ) : (
                <Link to="/login" className="header-btn block text-center" onClick={() => setIsMenuOpen(false)}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
