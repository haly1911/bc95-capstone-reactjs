import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#16091F] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
        <div className="flex flex-col gap-4">
          <Link to="/" className="font-serif text-3xl tracking-wide block">
            Lumière<span className="text-[#F0BB3B]">.</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            Trải nghiệm điện ảnh đẳng cấp với công nghệ trình chiếu hiện đại và dịch vụ cao cấp tại hơn 40 cụm rạp trên toàn quốc.
          </p>
          <div className="flex gap-3 mt-2">
            <Link
              to="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-gray-400 transition hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
            >
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </Link>
            <Link
              to="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-gray-400 transition hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
            >
              <i className="fa-brands fa-instagram text-sm"></i>
            </Link>
            <Link
              to="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-gray-400 transition hover:border-[#F0BB3B] hover:text-[#F0BB3B]"
            >
              <i className="fa-brands fa-youtube text-sm"></i>
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#F0BB3B]">Khám phá</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/schedule" className="hover:text-[#F0BB3B] transition">
                Lịch chiếu
              </Link>
            </li>
            <li>
              <Link to="/cinema" className="hover:text-[#F0BB3B] transition">
                Cụm rạp
              </Link>
            </li>
            <li>
              <Link to="/promotion" className="hover:text-[#F0BB3B] transition">
                Ưu đãi
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#F0BB3B]">Hỗ trợ</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>
              <Link to="#" className="hover:text-[#F0BB3B] transition">
                Hướng dẫn đặt vé
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#F0BB3B] transition">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#F0BB3B] transition">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#F0BB3B] transition">
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#F0BB3B]">Liên hệ</h4>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-map-pin mt-0.5 text-[#F0BB3B] shrink-0"></i> 
              <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="fa-solid fa-phone text-[#F0BB3B] shrink-0"></i> 
              <span>1900 6017</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="fa-solid fa-envelope text-[#F0BB3B] shrink-0"></i> 
              <span>hello@lumiere.vn</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Lumière Cinemas. Mọi quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;