import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../utils/formatPrice";
import {
  getBadgeClassName,
  getPrimaryProductImageAlt,
  getProductBadges,
  getProductDisplayPrice,
  getSecondaryProductImageAlt,
} from "../utils/productPresentation";

const getAvailableSizes = (sizes = []) =>
  sizes.filter((item) => item.stock > 0).map((item) => item.size);

const imageMotion = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.05, y: -6 },
};

function ProductCard({ product }) {
  const primaryImage =
    product.imageUrls?.[0] ||
    "https://dummyimage.com/800x1000/e5e7eb/0f172a&text=Shoe";
  const secondaryImage = product.imageUrls?.[1] || primaryImage;
  const availableSizes = getAvailableSizes(product.sizes || []);
  const totalStock = Number(product.stockQuantity ?? 0);
  const badges = getProductBadges(product);
  const displayPrice = getProductDisplayPrice(product);
  const isOutOfStock = totalStock <= 0;
  const stockMessage = isOutOfStock
    ? "Tạm hết hàng"
    : totalStock <= 5
      ? `Còn ${totalStock} đôi`
      : "Còn hàng";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      animate="rest"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-premium"
    >
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-shoe-stage">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_25%)]" />

        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 backdrop-blur">
            {product.brand}
          </span>
          {badges.map((badge) => (
            <span
              key={badge.key}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${getBadgeClassName(
                badge.tone
              )}`}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
          <motion.img
            variants={imageMotion}
            src={primaryImage}
            alt={getPrimaryProductImageAlt(product)}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-contain px-6 py-7 drop-shadow-2xl transition duration-500 ${
              secondaryImage !== primaryImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {secondaryImage !== primaryImage && (
            <motion.img
              variants={imageMotion}
              src={secondaryImage}
              alt={getSecondaryProductImageAlt(product)}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain px-6 py-7 drop-shadow-2xl opacity-0 transition duration-500 group-hover:opacity-100"
            />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${product._id}`}
              className="block text-lg font-bold tracking-tight text-slate-950 transition hover:text-orange-600"
            >
              {product.name}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {product.description ||
                "Thiết kế gọn, đệm êm và chất liệu bền cho nhu cầu đi làm, đi chơi hoặc phối đồ mỗi ngày."}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isOutOfStock
                ? "bg-rose-50 text-rose-700"
                : totalStock <= 5
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {stockMessage}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {availableSizes.length > 0 ? (
            <>
              {availableSizes.slice(0, 5).map((size) => (
                <span
                  key={`${product._id}-${size}`}
                  className="inline-flex min-w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  {size}
                </span>
              ))}
              {availableSizes.length > 5 && (
                <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                  +{availableSizes.length - 5}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs font-medium text-slate-400">Hiện chưa có size khả dụng</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Giá bán
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-2xl font-black tracking-tight text-slate-950">
                {formatPrice(displayPrice.currentPrice)}
              </p>
              {displayPrice.compareAtPrice && (
                <p className="text-sm font-semibold text-slate-400 line-through">
                  {formatPrice(displayPrice.compareAtPrice)}
                </p>
              )}
            </div>
          </div>

          <Link
            to={`/product/${product._id}`}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
              isOutOfStock
                ? "border border-slate-200 text-slate-500 hover:border-slate-300"
                : "bg-slate-950 text-white hover:bg-slate-800"
            }`}
          >
            {isOutOfStock ? "Xem chi tiết" : "Chọn size"}
            <span className="text-base leading-none">→</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;