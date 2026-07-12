import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMovieList } from "../../hooks/useMovies";
import { useCinemaChains, useCinemaComplexesByChain } from "../../hooks/useCinema";
import { useCreateSchedule } from "../../hooks/useSchedule";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDateTimeForSubmit } from "../../utils/date";
import MovieInfoCard from "../../components/MovieInfoCard";

const scheduleValidationSchema = Yup.object({
  maPhim: Yup.string().required("Vui lòng chọn phim"),
  maRap: Yup.string().required("Vui lòng chọn cụm rạp"),
  ngayChieuGioChieu: Yup.string().required("Vui lòng chọn ngày giờ chiếu"),
  giaVe: Yup.number()
    .required("Vui lòng nhập giá vé")
    .min(75000, "Giá vé tối thiểu là 75.000")
    .max(300000, "Giá vé tối đa là 300.000"),
});

const CreateSchedulePage = () => {
  const [selectedCinemaChain, setSelectedCinemaChain] = useState("");
  const { data: movieData, isLoading: movieLoading } = useMovieList("GP01", 1, 1000, "");
  const { data: cinemaChains } = useCinemaChains();
  const { data: cinemaComplexes } = useCinemaComplexesByChain(selectedCinemaChain);

  const createSchedule = useCreateSchedule();

  const movies = movieData?.items || [];

  const formik = useFormik({
    initialValues: {
      maPhim: "",
      maRap: "",
      ngayChieuGioChieu: "",
      giaVe: 75000,
    },
    validationSchema: scheduleValidationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        ngayChieuGioChieu: formatDateTimeForSubmit(values.ngayChieuGioChieu),
      };
      createSchedule.mutate(payload, {
        onSuccess: () => {
          toast.success("Tạo lịch chiếu thành công");
          formik.resetForm();
          setSelectedCinemaChain("");
        },
        onError: (err) => {
          toast.error(err.response?.data?.content || "Có lỗi xảy ra!");
        },
      });
    },
  });

  const selectedMovie = movies.find((movie) => movie.maPhim === Number(formik.values.maPhim));

  if (movieLoading) {
    return (
      <div className="wrapper min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="wrapper min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Quản lý <span className="text-[#F0BB3B]">Lịch chiếu</span>
          </h1>
          <p className="mt-2 text-gray-400">Tạo lịch chiếu mới cho các bộ phim</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT */}
        <MovieInfoCard movie={selectedMovie} />
        {/* RIGHT */}
        <form onSubmit={formik.handleSubmit} className="rounded-2xl border border-[#442c54]/50 bg-[#2a1b35]/70 p-6">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Bộ phim</label>
              <select
                name="maPhim"
                value={formik.values.maPhim}
                onChange={formik.handleChange}
                className="w-full rounded-xl border border-[#523765] bg-[#1f1528] p-3 outline-none focus:border-[#F0BB3B] cursor-pointer"
              >
                <option value="">Chọn phim</option>
                {movies.map((movie) => (
                  <option key={movie.maPhim} value={movie.maPhim}>
                    {movie.tenPhim}
                  </option>
                ))}
              </select>

              {formik.touched.maPhim && formik.errors.maPhim && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.maPhim}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Hệ thống rạp</label>
              <select
                value={selectedCinemaChain}
                onChange={(e) => {
                  setSelectedCinemaChain(e.target.value);
                  formik.setFieldValue("maRap", "");
                }}
                className="w-full rounded-xl border border-[#523765] bg-[#1f1528] p-3 outline-none focus:border-[#F0BB3B] cursor-pointer"
              >
                <option value="">Chọn hệ thống rạp</option>
                {cinemaChains?.map((chain) => (
                  <option key={chain.maHeThongRap} value={chain.maHeThongRap}>
                    {chain.tenHeThongRap}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Cụm rạp</label>
              <select
                name="maRap"
                value={formik.values.maRap}
                onChange={formik.handleChange}
                disabled={!selectedCinemaChain}
                className={`w-full rounded-xl border border-[#523765] bg-[#1f1528] p-3 outline-none disabled:opacity-50 focus:border-[#F0BB3B] ${selectedCinemaChain ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <option value="">Chọn cụm rạp</option>
                {cinemaComplexes?.map((complex) => (
                  <option key={complex.maCumRap} value={complex.maCumRap}>
                    {complex.tenCumRap}
                  </option>
                ))}
              </select>
              {formik.touched.maRap && formik.errors.maRap && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.maRap}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Ngày giờ chiếu</label>
              <input
                type="datetime-local"
                name="ngayChieuGioChieu"
                value={formik.values.ngayChieuGioChieu}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-xl border border-[#523765] bg-[#1f1528] p-3 outline-none transition focus:border-[#F0BB3B] cursor-pointer"
              />
              {formik.touched.ngayChieuGioChieu && formik.errors.ngayChieuGioChieu && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.ngayChieuGioChieu}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Giá vé</label>
              <input
                type="number"
                name="giaVe"
                min={75000}
                max={300000}
                step={5000}
                value={formik.values.giaVe}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-xl border border-[#523765] bg-[#1f1528] p-3 outline-none transition focus:border-[#F0BB3B] cursor-pointer"
              />
              {formik.touched.giaVe && formik.errors.giaVe && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.giaVe}</p>
              )}
            </div>
            {selectedMovie && (
              <div className="rounded-xl border border-[#F0BB3B] bg-[#1f1528]/50 p-4">
                <h3 className="mb-3 font-semibold text-[#F0BB3B]">Thông tin lịch chiếu</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Phim</span>
                    <span className="font-medium">{selectedMovie.tenPhim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cụm rạp</span>
                    <span className="font-medium">
                      {cinemaComplexes?.find((c) => String(c.maCumRap) === String(formik.values.maRap))?.tenCumRap ||
                        "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá vé</span>
                    <span className="font-medium text-[#F0BB3B]">
                      {Number(formik.values.giaVe).toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={createSchedule.isPending || !formik.isValid}
              className="w-full cursor-pointer rounded-full bg-[#F0BB3B] px-6 py-3 font-bold text-gray-900 transition hover:bg-[#dfac30] disabled:cursor-not-allowed disabled:bg-yellow-800/50"
            >
              {createSchedule.isPending ? "Đang tạo..." : "Tạo lịch chiếu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSchedulePage;
