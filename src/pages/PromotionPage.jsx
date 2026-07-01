import React, { useState } from "react";

const MOCK_PROMOTIONS = [
  {
    id: 1,
    title: "Ngày Hội Thành Viên - Đồng Giá Vé 55K",
    description:
      "Áp dụng vào mỗi thứ Hai đầu tiên của tháng cho tất cả các thành viên đăng ký tài khoản trực tuyến.",
    category: "ve",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
    expiryDate: "31/12/2026",
    tag: "Hot",
  },
  {
    id: 2,
    title: "Combo Bắp Nước Siêu Anh Hùng - Giảm 30%",
    description:
      "Mua kèm vé xem phim bom tấn bất kỳ để nhận ngay ưu đãi giảm giá sâu cho Combo bắp ngọt và nước lớn.",
    category: "bap-nuoc",
    image:
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500&auto=format&fit=crop&q=60",
    expiryDate: "15/08/2026",
    tag: "Bán chạy",
  },
  {
    id: 3,
    title: "Ưu Đãi Thẻ Ngân Hàng - Hoàn Tiền 20%",
    description:
      "Thanh toán bằng thẻ Visa/Mastercard của các ngân hàng liên kết để nhận lượt hoàn tiền trực tiếp vào ví.",
    category: "thanh-toan",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60",
    expiryDate: "30/09/2026",
    tag: "Liên kết",
  },
  {
    id: 4,
    title: "Học Sinh Sinh Viên - Suất Chiếu Sớm 45K",
    description:
      "Xuất trình thẻ HSSV tại quầy vé cho các suất chiếu trước 12:00 trưa từ thứ Hai đến thứ Sáu.",
    category: "ve",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    expiryDate: "31/12/2026",
    tag: "HSSV",
  },
];

const CATEGORIES = [
  { id: "all", name: "Tất cả" },
  { id: "ve", name: "Ưu đãi Vé" },
  { id: "bap-nuoc", name: "Bắp & Nước" },
  { id: "thanh-toan", name: "Thanh toán" },
];

const PromotionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPromotions =
    activeTab === "all"
      ? MOCK_PROMOTIONS
      : MOCK_PROMOTIONS.filter((promo) => promo.category === activeTab);

  return (
    <div className="min-h-screen wrapper pt-40">
      <div className="pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Chương trình{" "}
          <span className="text-[#f0bb3b] drop-shadow-[0_2px_10px_rgba(240,187,59,0.3)]">
            Khuyến mãi
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Săn ngay ưu đãi độc quyền, xem phim thả ga không lo về giá
        </p>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => {
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? "bg-[#f0bb3b] border-[#f0bb3b] text-black shadow-[0_4px_15px_rgba(240,187,59,0.3)]"
                      : "bg-[#2a1b35]/60 border-[#442c54]/50 text-gray-400 hover:text-white hover:border-[#f0bb3b]/50 backdrop-blur-lg"
                  }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPromotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#2a1b35]/60 border border-[#442c54]/50 rounded-2xl overflow-hidden backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#f0bb3b]/60 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#f0bb3b] text-black text-xs font-bold px-3 py-1 rounded-md shadow-md uppercase">
                  {promo.tag}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#f0bb3b] transition-colors duration-200 line-clamp-1">
                    {promo.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {promo.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-950/40 flex items-center justify-between mt-auto">
                  <div className="text-xs text-gray-500">
                    Hạn dùng:{" "}
                    <span className="text-gray-300 font-medium">
                      {promo.expiryDate}
                    </span>
                  </div>
                  <button className="text-[#f0bb3b] hover:text-white font-semibold text-sm transition-colors cursor-pointer flex items-center gap-1 group/btn">
                    Chi tiết
                    <span className="transform group-hover/btn:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredPromotions.length === 0 && (
          <div className="text-center py-20 bg-[#2a1b35]/30 border border-[#442c54]/30 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-400">
              Hiện chưa có chương trình khuyến mãi nào trong mục này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
