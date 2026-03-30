import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const location = useLocation();
  const { userInfo } = useAuth();

  if (!userInfo?.token) {
    const redirectPath = `${location.pathname}${location.search}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  if (!userInfo.isAdmin) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
            403 Forbidden
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Bạn không có quyền truy cập khu vực quản trị
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Route này chỉ dành cho admin. Nếu tài khoản của bạn cần thêm quyền,
            hãy cập nhật isAdmin ở backend.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Quay về trang chủ
          </Link>
        </div>
      </section>
    );
  }

  return children;
}

export default AdminRoute;

