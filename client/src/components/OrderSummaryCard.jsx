import { formatPrice } from "../utils/formatPrice";

function OrderSummaryCard({
  eyebrow,
  title = "Tóm tắt đơn hàng",
  itemCount = 0,
  itemsPrice = 0,
  shippingPrice = 0,
  totalPrice = 0,
  showFreeShippingProgress = false,
  remainingForFreeShipping = 0,
  freeShippingProgress = 0,
  actionLabel,
  onAction,
  actionDisabled = false,
  actionLoading = false,
  helperText,
  children,
}) {
  return (
    <div className="surface-card p-6 sm:p-7">
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>

      {showFreeShippingProgress && itemCount > 0 && (
        <div className="surface-muted mt-5 p-4">
          {remainingForFreeShipping > 0 ? (
            <>
              <p className="text-sm leading-6 text-slate-600">
                Mua thêm{" "}
                <span className="font-semibold text-orange-600">
                  {formatPrice(remainingForFreeShipping)}
                </span>{" "}
                để được miễn phí giao hàng.
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-emerald-700">
              Bạn đã đạt mốc miễn phí giao hàng.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-4">
          <span>Tạm tính ({itemCount} sản phẩm)</span>
          <span className="font-semibold text-slate-950">
            {formatPrice(itemsPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Phí giao hàng</span>
          <span className="font-semibold text-slate-950">
            {shippingPrice === 0 ? (
              <span className="text-emerald-700">Miễn phí</span>
            ) : (
              formatPrice(shippingPrice)
            )}
          </span>
        </div>
        <div className="soft-divider pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-semibold text-slate-950">
              Tổng cộng
            </span>
            <span className="text-2xl font-black tracking-tight text-orange-600">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled || actionLoading}
          className="btn-primary mt-6 w-full py-4 text-sm sm:text-base"
        >
          {actionLoading ? "Đang xử lý..." : actionLabel}
        </button>
      )}

      {helperText && (
        <p className="mt-3 text-xs leading-6 text-slate-500">{helperText}</p>
      )}

      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}

export default OrderSummaryCard;