import { Link, useNavigate } from "react-router-dom";
import EmptyStateCard from "../components/EmptyStateCard";
import OrderSummaryCard from "../components/OrderSummaryCard";
import SectionHeading from "../components/SectionHeading";
import TrustBar from "../components/TrustBar";
import { useStore } from "../context/StoreContext";
import usePageMeta from "../hooks/usePageMeta";
import { FREE_SHIPPING_THRESHOLD, getCartPricing } from "../utils/cartPricing";
import { formatPrice } from "../utils/formatPrice";

const cartTrustItems = [
  {
    icon: "returns",
    label: "Đổi size 7 ngày",
    description: "Phù hợp với sản phẩm giày cần kiểm tra lại form chân sau khi nhận hàng.",
  },
  {
    icon: "shipping",
    label: "Giao hàng toàn quốc",
    description: "Đơn từ 2.000.000đ được miễn phí ship để shopper dễ chốt hơn.",
  },
  {
    icon: "payment",
    label: "COD linh hoạt",
    description: "Giảm rào cản cho khách mua lần đầu hoặc chưa quen thương hiệu.",
  },
  {
    icon: "secure",
    label: "Xác nhận đơn an toàn",
    description: "Thông tin giỏ và checkout được lưu xuyên suốt trong phiên mua hàng.",
  },
];

function CartScreen() {
  const navigate = useNavigate();
  const { cart, removeCartItem, updateCartItemQuantity } = useStore();

  const cartItems = cart.cartItems || [];
  const {
    itemCount,
    itemsPrice,
    shippingPrice,
    totalPrice,
    remainingForFreeShipping,
    freeShippingProgress,
  } = getCartPricing(cartItems);

  usePageMeta({
    title: "Giỏ hàng",
    description:
      cartItems.length > 0
        ? `Bạn đang có ${itemCount} sản phẩm trong giỏ hàng.`
        : "Giỏ hàng đang trống. Chọn sản phẩm và thêm vào giỏ để bắt đầu mua hàng.",
  });

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <section className="page-shell py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeading
          eyebrow="Cart"
          title={
            cartItems.length > 0
              ? `${itemCount} sản phẩm đang chờ bạn chốt đơn`
              : "Giỏ hàng của bạn đang trống"
          }
          description={
            cartItems.length > 0
              ? "Trang giỏ hàng được làm gọn để bạn xem nhanh ảnh, size, số lượng và tổng tiền trước khi chuyển sang checkout."
              : "Khi bạn thêm sản phẩm từ PDP, giỏ hàng sẽ hiển thị đầy đủ hình ảnh, size, số lượng và tổng tiền ngay tại đây."
          }
          action={<Link to="/products" className="btn-ghost">Tiếp tục mua sắm</Link>}
        />

        {cartItems.length === 0 ? (
          <div className="space-y-6">
            <EmptyStateCard
              eyebrow="Empty cart"
              title="Chưa có sản phẩm nào trong giỏ"
              description="Khám phá danh mục sản phẩm để chọn đôi phù hợp, sau đó quay lại đây để hoàn tất đơn hàng trong vài bước ngắn."
              actionLabel="Khám phá sản phẩm"
              actionTo="/products"
            />
            <TrustBar items={cartTrustItems} />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <div className="surface-card p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="section-eyebrow">Shipping goal</p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                      {remainingForFreeShipping > 0
                        ? `Mua thêm ${formatPrice(remainingForFreeShipping)} để được miễn phí giao hàng`
                        : "Bạn đã đạt mốc miễn phí giao hàng"}
                    </h2>
                  </div>
                  <span className="info-chip border-orange-200 bg-orange-50 text-orange-700">
                    Miễn phí ship từ {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {cartItems.map((item) => {
                const canIncrease = !item.stock || item.quantity < item.stock;
                const canDecrease = item.quantity > 1;

                return (
                  <article
                    key={`${item.product}-${item.size}`}
                    className="surface-card p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link
                        to={`/product/${item.product}`}
                        className="h-28 w-full overflow-hidden rounded-[1.5rem] bg-slate-100 sm:h-28 sm:w-28 sm:flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={`Ảnh ${item.name} size ${item.size}`}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <Link
                              to={`/product/${item.product}`}
                              className="line-clamp-2 text-base font-bold tracking-tight text-slate-950 transition hover:text-orange-600"
                            >
                              {item.name}
                            </Link>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="info-chip">Size {item.size}</span>
                              <span className="info-chip">Đơn giá {formatPrice(item.price)}</span>
                              {item.stock > 0 && item.stock <= 5 && (
                                <span className="info-chip border-amber-200 bg-amber-50 text-amber-700">
                                  Còn ít hàng
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                              Thành tiền
                            </p>
                            <p className="mt-1 text-xl font-black tracking-tight text-slate-950">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-soft">
                            <button
                              type="button"
                              disabled={!canDecrease}
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.product,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              aria-label={`Giảm số lượng ${item.name}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                              -
                            </button>
                            <span className="inline-flex min-w-10 items-center justify-center text-sm font-bold text-slate-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={!canIncrease}
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.product,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              aria-label={`Tăng số lượng ${item.name}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCartItem(item.product, item.size)}
                            aria-label={`Xóa ${item.name} size ${item.size}`}
                            className="text-sm font-semibold text-slate-500 transition hover:text-rose-600"
                          >
                            Xóa sản phẩm
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <OrderSummaryCard
                eyebrow="Order summary"
                title="Tóm tắt đơn hàng"
                itemCount={itemCount}
                itemsPrice={itemsPrice}
                shippingPrice={shippingPrice}
                totalPrice={totalPrice}
                showFreeShippingProgress
                remainingForFreeShipping={remainingForFreeShipping}
                freeShippingProgress={freeShippingProgress}
                actionLabel="Tiếp tục thanh toán"
                onAction={checkoutHandler}
                helperText="Giá trị đơn cuối cùng vẫn được backend xác nhận lại ở bước đặt hàng để đảm bảo chính xác."
              />
              <TrustBar items={cartTrustItems} compact />
            </aside>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{itemCount} sản phẩm</p>
                <p className="text-lg font-black text-orange-600">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              <button
                type="button"
                onClick={checkoutHandler}
                className="btn-primary min-w-[150px] px-4 py-3 text-sm"
              >
                Checkout
              </button>
            </div>
          </div>
          <div className="h-20 lg:hidden" />
        </>
      )}
    </section>
  );
}

export default CartScreen;