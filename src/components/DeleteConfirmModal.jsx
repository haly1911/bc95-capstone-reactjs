import React from "react";

const DeleteConfirmModal = ({ open, title, message, confirmText = "Xóa", loading = false, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-linear-to-br from-[#16091F] to-[#2A0617] rounded-2xl border border-red-950/40 w-full max-w-md shadow-2xl p-6 text-center transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-2xl mb-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 className="text-white text-xl font-black mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onClose} className="cancel-btn">
            Huỷ
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-red-600/20 cursor-pointer"
          >
            {loading ? "Đang xoá..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
