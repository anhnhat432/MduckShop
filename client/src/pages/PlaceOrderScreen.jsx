import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import CheckoutSteps from "../components/CheckoutSteps";
import OrderSummaryCard from "../components/OrderSummaryCard";
import TrustBar from "../components/TrustBar";
import { useStore } from "../context/StoreContext";
import usePageMeta from "../hooks/usePageMeta";
import { getApiErrorMessage } from "../utils/apiError";
import { getCartPricing } from "../utils/cartPricing";
import { getPlaceOrderGuardRedirect } from "../utils/checkoutGuards";
import { formatPrice } from "../utils/formatPrice";

const confirmationTrustItems = [
  {
    icon: "shipping",
    label: "Giao đúng thông tin đã xác nhận",
    description: "Địa chỉ và số điện thoại bạn nhập sẽ được dùng xuyên suốt flow xử lý đơn.",
  },
  {
    icon: "returns",
    label: "Hỗ trợ sau mua rõ ràng",
    description: "Nếu cần đổi size, shopper có thể liên hệ ngay sau khi nhận hàng.",
  },
  {
    icon: "secure",
    label: "Backend xác nhận lại giá",
    description: "Tổng giá trị đơn được server kiểm tra lại để đảm bảo chính xác.",
  },
  {
    icon: "payment",
    label: "COD an toàn",
    description: "Không cần nhập thông tin thẻ trong flow hiện tại.",
  },
];

function PlaceOrderScreen() {
  const navigate = useNavigate();
  const { cart, clearCartItems } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cartItems = cart.cartItems || [];
  const { itemCount, itemsPrice, shippingPrice, totalPrice } =
    getCartPricing(cartItems);

  usePageMeta({
    title: "Xác nhận đơn hàng",
    description: "Kiểm tra lại thông tin giao hàng, thanh toán và sản phẩm trước khi đặt đơn trên ShoeStore.",
  });

  useEffect(() => {
    const redirectPath = getPlaceOrderGuardRedirect(cart);

    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      };

      const response = await axiosClient.post("/orders", payload);

      clearCartItems();
      navigate(`/order-success/${response.data.data._id}`, {
        state: { order: response.data.data },
      });
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Không thể tạo đơn hàng. Vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <CheckoutSteps step1 step2 step3 />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4">
            <div className="surface-card p-6 sm:p-8">
              <p className="section-eyebrow">Review order</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Kiểm tra lần cuối trước khi đặt hàng
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Bố cục này ưu tiên sự rõ ràng: thông tin giao hàng, phương thức thanh toán và danh sách sản phẩm đều nằm trên cùng một màn hình để shopper chốt đơn tự tin hơn.
              </p>
            </div>

            <div className="surface-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-eyebrow">Shipping</p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                    Địa chỉ giao hàng
                  </h2>
                </div>
                <Link to="/shipping" className="btn-ghost px-4 py-2 text-xs">
                  Chỉnh sửa
                </Link>
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
                <p className="font-semibold text-slate-950">
                  {cart.shippingAddress.address}
                </p>
                <p>{cart.shippingAddress.city}</p>
                <p>Số điện thoại: {cart.shippingAddress.phoneNumber}</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-eyebrow">Payment</p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                    Phương thức thanh toán
                  </h2>
                </div>
                <Link to="/payment" className="btn-ghost px-4 py-2 text-xs">
                  Chỉnh sửa
                </Link>
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
                <p className="font-semibold text-slate-950">{cart.paymentMethod}</p>
                <p>Thanh toán khi nhận hàng, không cần nhập thông tin thẻ trong flow hiện tại.</p>
              </div>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="section-eyebrow">Items</p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                    Sản phẩm trong đơn
                  </h2>
                </div>
                <span className="info-chip">{itemCount} sản phẩm</span>
              </div>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <article
                    key={`${item.product}-${item.size}`}
                    className="surface-muted p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img
                        src={item.image}
                        alt={`Ảnh ${item.name} size ${item.size}`}
                        className="h-24 w-full rounded-[1.25rem] object-cover sm:h-24 sm:w-24 sm:flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-base font-bold tracking-tight text-slate-950">
                          {item.name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                          <span className="info-chip">Size {item.size}</span>
                          <span className="info-chip">Số lượng {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-lg font-black tracking-tight text-slate-950">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <OrderSummaryCard
              eyebrow="Final summary"
              title="Xác nhận và đặt hàng"
              itemCount={itemCount}
              itemsPrice={itemsPrice}
              shippingPrice={shippingPrice}
              totalPrice={totalPrice}
              actionLabel="Đặt hàng"
              onAction={placeOrderHandler}
              actionDisabled={cartItems.length === 0}
              actionLoading={loading}
              helperText="Tổng tiền ở đây là phần hiển thị cho shopper; backend vẫn sẽ xác nhận lại giá trước khi tạo đơn."
            >
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
            </OrderSummaryCard>
            <TrustBar items={confirmationTrustItems} compact />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default PlaceOrderScreen;