import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#16091F] text-white">
      <div className="wrapper py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link to="/" className="font-serif text-3xl tracking-wide block">
            Lumière<span className="text-[#F0BB3B]">.</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Trải nghiệm điện ảnh đẳng cấp với công nghệ trình chiếu hiện đại và dịch vụ cao cấp tại hơn 40 cụm rạp trên
            toàn quốc.
          </p>
          <div className="flex gap-3 mt-2">
            <Link to="#" className="footer-icon">
              <i className="fa-brands fa-facebook-f fa-sm"></i>
            </Link>
            <Link to="#" className="footer-icon">
              <i className="fa-brands fa-instagram fa-sm"></i>
            </Link>
            <Link to="#" className="footer-icon">
              <i className="fa-brands fa-youtube fa-sm"></i>
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#F0BB3B]">Khám phá</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/schedule" className="nav-titles">
                Lịch chiếu
              </Link>
            </li>
            <li>
              <Link to="/cinema" className="nav-titles">
                Cụm rạp
              </Link>
            </li>
            <li>
              <Link to="/promotion" className="nav-titles">
                Ưu đãi
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#F0BB3B]">Hỗ trợ</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="#" className="nav-titles">
                Hướng dẫn đặt vé
              </Link>
            </li>
            <li>
              <Link to="#" className="nav-titles">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="#" className="nav-titles">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="#" className="nav-titles">
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#F0BB3B]">Liên hệ</h4>
          <ul className="mt-4 space-y-3 text-sm">
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
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} Lumière Cinemas. Mọi quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
