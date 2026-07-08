import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import MovieListPage from "./pages/MovieListPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import CinemaPage from "./pages/CinemaPage";
import PromotionsPage from "./pages/PromotionPage";
import SchedulePage from "./pages/SchedulePage";
import BookingPage from "./pages/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentPage from "./pages/PaymentPage";
import ScrollToTop from "./components/ScrollToTop";
import ProfilePage from "./pages/ProfilePage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserManagementPage from "./pages/admin/UserManagementPage";
import MovieManagementPage from "./pages/admin/MovieManagementPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<MovieListPage />} />
              <Route path="movie" element={<MovieListPage />} />
              <Route path="movie/:maPhim" element={<MovieDetailPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="cinema" element={<CinemaPage />} />
              <Route path="promotion" element={<PromotionsPage />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              ></Route>
            </Route>
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<UserManagementPage />} />
              <Route path="users-management" element={<UserManagementPage />} />
              <Route path="movies-management" element={<MovieManagementPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right" // Hiện thông báo ở góc trên bên phải
          autoClose={3000} // Tự động đóng sau 3 giây
          hideProgressBar={false} // Hiện thanh chạy thời gian (thanh progress)
          newestOnTop={false}
          closeOnClick={true} // Click vào thông báo để tắt nhanh
          rtl={false}
          pauseOnFocusLoss={false} // Không dừng thanh chạy khi tab bị mờ
          draggable={true} // Cho phép vuốt để tắt trên điện thoại
          pauseOnHover={true} // Di chuột vào thì dừng thời gian đếm ngược
          theme="dark" // Chuyển sang theme tối để khớp với background rạp phim
        />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
