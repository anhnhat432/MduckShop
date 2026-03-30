import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import EmptyStateCard from "../components/EmptyStateCard";
import OrderSummaryCard from "../components/OrderSummaryCard";
import SectionHeading from "../components/SectionHeading";
import TrustBar from "../components/TrustBar";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";
import { getApiErrorMessage } from "../utils/apiError";
import { formatPrice } from "../utils/formatPrice";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Chưa cập nhật";

const getPaymentStatusConfig = (order) => {
  if (order?.isPaid) {
    return {
      label: "Đã thanh toán",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      description: order.paidAt
        ? `Xác nhận lúc ${formatDate(order.paidAt)}.`
        : "Thanh toán đã được xác nhận.",
    };
  }

  if (order?.paymentMethod === "COD") {
    return {
      label: "Thanh toán khi nhận hàng",
      className: "border-sky-200 bg-sky-50 text-sky-700",
      description: "Bạn sẽ thanh toán khi nhận hàng theo phương thức COD.",
    };
  }

  return {
    label: "Chưa thanh toán",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    description: "Đơn hàng đang chờ xác nhận thanh toán.",
  };
};

const getDeliveryStatusConfig = (order) => {
  if (order?.isDelivered) {
    return {
      label: "Đã giao",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      description: order.deliveredAt
        ? `Đơn hàng đã giao lúc ${formatDate(order.deliveredAt)}.`
        : "Đơn hàng đã được giao thành công.",
    };
  }

  return {
    label: "Đang xử lý",
    className: "border-orange-200 bg-orange-50 text-orange-700",
    description:
      "Đơn hàng đang được xác nhận, đóng gói hoặc chờ bàn giao cho đơn vị vận chuyển.",
  };
};

const orderTrustItems = [
  {
    icon: "shipping",
    label: "Thông tin giao hàng đã khóa",
    description: "Địa chỉ và số điện thoại trong đơn đang được dùng để xử lý giao nhận.",
  },
  {
    icon: "returns",
    label: "Hỗ trợ đổi size sau mua",
    description: "Nếu cần đổi size, shopper có thể liên hệ ngay sau khi nhận hàng.",
  },
  {
    icon: "support",
    label: "Theo dõi đơn dễ dàng",
    description: "Trạng thái thanh toán và giao hàng luôn được hiển thị rõ trên màn này.",
  },
  {
    icon: "secure",
    label: "Tổng tiền đã được xác nhận",
    description: "Giá trị đơn ở đây là dữ liệu đã được hệ thống lưu khi tạo đơn hàng.",
  },
];

function OrderScreen() {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  usePageMeta({
    title: order ? `Đơn hàng ${order._id}` : "Chi tiết đơn hàng",
    description:
      "Theo dõi trạng thái thanh toán, giao hàng và chi tiết sản phẩm trong đơn hàng của bạn trên ShoeStore.",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(`/orders/${id}`);

        if (isMounted) {
          setOrder(response.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            getApiErrorMessage(err, "Không thể tải chi tiết đơn hàng.")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const markDeliveredHandler = async () => {
    try {
      setDeliverLoading(true);
      setActionError("");

      const response = await axiosClient.put(`/orders/${id}/deliver`);

      setOrder((prevOrder) => ({
        ...prevOrder,
        isDelivered: true,
        deliveredAt: response.data.data.deliveredAt,
      }));
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, "Không thể cập nhật trạng thái giao hàng.")
      );
    } finally {
      setDeliverLoading(false);
    }
  };

  const itemCount = useMemo(
    () =>
      (order?.orderItems || []).reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
      ),
    [order?.orderItems]
  );

  const paymentStatus = useMemo(() => getPaymentStatusConfig(order), [order]);
  const deliveryStatus = useMemo(() => getDeliveryStatusConfig(order), [order]);
  const backLink = userInfo?.isAdmin ? "/admin/orders" : "/products";
  const backLabel = userInfo?.isAdmin
    ? "Về danh sách đơn hàng"
    : "Tiếp tục mua sắm";

  if (loading) {
    return (
      <section className="page-shell py-8 sm:py-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="surface-card p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="h-12 w-4/5 animate-pulse rounded-full bg-slate-100" />
                <div className="h-6 w-full animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`order-top-skeleton-${index}`} className="surface-muted p-4">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                    <div className="mt-3 h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="surface-card p-6">
                <div className="h-7 w-40 animate-pulse rounded-full bg-slate-100" />
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="surface-muted p-4">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
                    <div className="mt-4 space-y-3">
                      <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                      <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                  <div className="surface-muted p-4">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
                    <div className="mt-4 space-y-3">
                      <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                      <div className="h-3 w-4/6 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6">
                <div className="h-7 w-44 animate-pulse rounded-full bg-slate-100" />
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={`order-item-skeleton-${index}`} className="surface-muted p-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 animate-pulse rounded-[1.25rem] bg-slate-100" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
                          <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-4 h-7 w-48 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`order-summary-skeleton-${index}`} className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell py-10">
        <div className="mx-auto max-w-3xl space-y-5">
          <EmptyStateCard
            eyebrow="Không thể hiển thị đơn hàng"
            title="Đơn hàng hiện chưa khả dụng"
            description={error}
            actionLabel={backLabel}
            actionTo={backLink}
          />
          <div className="flex justify-center">
            <Link to="/" className="btn-ghost">
              Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="surface-card overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="section-eyebrow">Order detail</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Theo dõi đơn hàng của bạn trong một màn hình gọn, rõ và đáng tin.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Màn hình này được sắp lại theo hướng storefront thật: shopper nhìn 3 giây là nắm được mã đơn, trạng thái thanh toán, tiến độ giao hàng và tổng giá trị đơn.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="info-chip">Mã đơn: {order._id}</span>
                <span className={`info-chip ${paymentStatus.className}`}>
                  {paymentStatus.label}
                </span>
                <span className={`info-chip ${deliveryStatus.className}`}>
                  {deliveryStatus.label}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Mã đơn hàng
                </p>
                <p className="mt-2 break-all text-sm font-bold text-slate-950">
                  {order._id}
                </p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Thanh toán
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">
                  {paymentStatus.label}
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  {paymentStatus.description}
                </p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Giao hàng
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">
                  {deliveryStatus.label}
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  {deliveryStatus.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4">
            <div className="surface-card p-6 sm:p-7">
              <SectionHeading
                eyebrow="Order info"
                title="Thông tin giao hàng và thanh toán"
                description="Địa chỉ nhận hàng và phương thức thanh toán được gom chung để shopper dễ đối chiếu với những gì đã xác nhận ở bước checkout."
                align="start"
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Địa chỉ giao hàng
                  </p>
                  <div className="mt-3 space-y-1 text-sm leading-7 text-slate-600">
                    <p className="font-semibold text-slate-950">
                      {order.user?.name || "Không xác định"}
                    </p>
                    <p>{order.shippingAddress?.address || "Chưa cập nhật"}</p>
                    <p>{order.shippingAddress?.city || "Chưa cập nhật"}</p>
                    <p>Số điện thoại: {order.shippingAddress?.phoneNumber || "Chưa cập nhật"}</p>
                    <p>Email: {order.user?.email || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Thanh toán và thời gian
                  </p>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-950">Phương thức thanh toán</p>
                      <p>{order.paymentMethod || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">Ngày đặt hàng</p>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                    {order.deliveredAt && (
                      <div>
                        <p className="font-semibold text-slate-950">Ngày giao thành công</p>
                        <p>{formatDate(order.deliveredAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Items"
                  title="Sản phẩm trong đơn"
                  description="Danh sách sản phẩm được trình bày như trong cart và place order để shopper nhận ra ngay size, số lượng và thành tiền từng dòng."
                  align="start"
                />
                <span className="info-chip">{itemCount} sản phẩm</span>
              </div>

              <div className="mt-6 space-y-4">
                {order.orderItems?.length > 0 ? (
                  order.orderItems.map((item, index) => {
                    const productId = item.product?._id || item.product;

                    return (
                      <article
                        key={`${productId}-${item.size}-${index}`}
                        className="surface-muted p-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          {productId ? (
                            <Link
                              to={`/product/${productId}`}
                              className="h-24 w-full overflow-hidden rounded-[1.25rem] bg-slate-100 sm:h-24 sm:w-24 sm:flex-shrink-0"
                            >
                              <img
                                src={item.image}
                                alt={`Ảnh ${item.name} size ${item.size}`}
                                className="h-full w-full object-cover"
                              />
                            </Link>
                          ) : (
                            <div className="h-24 w-full overflow-hidden rounded-[1.25rem] bg-slate-100 sm:h-24 sm:w-24 sm:flex-shrink-0">
                              <img
                                src={item.image}
                                alt={`Ảnh ${item.name} size ${item.size}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            {productId ? (
                              <Link
                                to={`/product/${productId}`}
                                className="line-clamp-2 text-base font-bold tracking-tight text-slate-950 transition hover:text-orange-600"
                              >
                                {item.name}
                              </Link>
                            ) : (
                              <p className="line-clamp-2 text-base font-bold tracking-tight text-slate-950">
                                {item.name}
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="info-chip">Size {item.size}</span>
                              <span className="info-chip">Số lượng {item.quantity}</span>
                              <span className="info-chip">Đơn giá {formatPrice(item.price)}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                              Thành tiền
                            </p>
                            <p className="mt-1 text-lg font-black tracking-tight text-slate-950">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="surface-muted p-5 text-sm leading-7 text-slate-600">
                    Đơn hàng hiện chưa có sản phẩm nào để hiển thị.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <OrderSummaryCard
              eyebrow="Order summary"
              title="Tóm tắt đơn hàng"
              itemCount={itemCount}
              itemsPrice={order.itemsPrice}
              shippingPrice={order.shippingPrice}
              totalPrice={order.totalPrice}
              helperText="Đây là số liệu của đơn hàng đã được tạo thành công và lưu trên hệ thống."
            >
              <div className="space-y-3">
                <div className={`rounded-2xl border px-4 py-3 text-sm ${paymentStatus.className}`}>
                  <p className="font-semibold">Thanh toán</p>
                  <p className="mt-1 leading-6">{paymentStatus.description}</p>
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-sm ${deliveryStatus.className}`}>
                  <p className="font-semibold">Giao hàng</p>
                  <p className="mt-1 leading-6">{deliveryStatus.description}</p>
                </div>

                {actionError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {actionError}
                  </div>
                )}

                {userInfo?.isAdmin && !order.isDelivered && (
                  <button
                    type="button"
                    onClick={markDeliveredHandler}
                    disabled={deliverLoading}
                    className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                      deliverLoading
                        ? "cursor-not-allowed bg-slate-200 text-slate-400"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {deliverLoading ? "Đang cập nhật..." : "Đánh dấu đã giao hàng"}
                  </button>
                )}
              </div>
            </OrderSummaryCard>

            <div className="surface-card p-6">
              <p className="section-eyebrow">Next actions</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                Hành động tiếp theo
              </h2>
              <div className="mt-6 space-y-3">
                <Link to={backLink} className="btn-primary w-full justify-center py-4 text-base">
                  {backLabel}
                </Link>
                <Link to="/" className="btn-ghost w-full justify-center py-4 text-base">
                  Về trang chủ
                </Link>
              </div>
            </div>

            <TrustBar items={orderTrustItems} compact />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default OrderScreen;