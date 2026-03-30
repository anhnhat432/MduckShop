import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "N/A";

const formatPrice = (price = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

function OrderListScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get("/orders");

        if (isMounted) {
          setOrders(response.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Không thể tải danh sách đơn hàng."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Admin Orders
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Quản lý đơn hàng
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Quay lại trang chủ
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
            Đang tải danh sách đơn hàng...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Ngày đặt</th>
                  <th className="px-4 py-3 font-semibold">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold">Thanh toán</th>
                  <th className="px-4 py-3 font-semibold">Giao hàng</th>
                  <th className="px-4 py-3 font-semibold">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="align-top">
                    <td className="px-4 py-4 font-mono text-xs text-slate-700">
                      {order._id}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">
                        {order.user?.name || "Không xác định"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.user?.email || "N/A"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.isDelivered
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.isDelivered ? "Đã giao" : "Đang xử lý"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrderListScreen;

