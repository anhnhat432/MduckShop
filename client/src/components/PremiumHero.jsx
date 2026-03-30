import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "../utils/formatPrice";

const fallbackSlides = [
  {
    id: "drop-1",
    eyebrow: "Bộ sưu tập mới",
    brand: "Nike",
    name: "Air Sculpt Velocity",
    description:
      "Thiết kế năng động, đệm êm và form gọn để mang đi học, đi làm hoặc phối đồ hằng ngày.",
    price: 3890000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    href: "/products",
    meta: "Size 39 - 44",
  },
  {
    id: "drop-2",
    eyebrow: "Xu hướng nổi bật",
    brand: "Adidas",
    name: "Forum Aero Edition",
    description:
      "Một lựa chọn dễ lên outfit, giữ được cảm giác hiện đại nhưng vẫn rất dễ phối trong đời sống hằng ngày.",
    price: 3290000,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    href: "/products",
    meta: "Size 38 - 43",
  },
  {
    id: "drop-3",
    eyebrow: "Best seller",
    brand: "New Balance",
    name: "990 Atelier Mesh",
    description:
      "Thoáng khí, êm chân và bền bỉ, phù hợp với shopper ưu tiên sự thoải mái để mang cả ngày.",
    price: 4190000,
    image:
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80",
    href: "/products",
    meta: "Size 39 - 45",
  },
];

function PremiumHero({ slides = [], loading = false }) {
  const prefersReducedMotion = useReducedMotion();
  const heroSlides = useMemo(
    () => (slides.length ? slides : fallbackSlides),
    [slides]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((prevIndex) =>
      heroSlides.length === 0 ? 0 : Math.min(prevIndex, heroSlides.length - 1)
    );
  }, [heroSlides.length]);

  useEffect(() => {
    if (prefersReducedMotion || heroSlides.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [heroSlides.length, prefersReducedMotion]);

  const currentSlide = heroSlides[activeIndex] || fallbackSlides[0];

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] bg-radial-premium text-white shadow-premium">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] animate-grid-drift" />
      </div>
      <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-electric-400/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-volt-500/10 blur-3xl" />

      <div className="relative grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-12">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              {loading ? "Đang cập nhật storefront" : currentSlide.eyebrow}
            </div>

            <div className="mt-6 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
                Sneaker storefront
              </p>
              <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-balance sm:text-5xl lg:text-6xl">
                Tìm đôi giày dễ chốt đơn hơn ngay từ lần lướt đầu tiên.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                Ảnh lớn, badge rõ, trust signals mạnh và CTA tập trung vào hành vi mua hàng thay vì phô diễn quá đà.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary bg-white px-6 text-slate-950 shadow-none hover:bg-white/90">
                Mua bộ sưu tập mới
              </Link>
              <Link
                to={currentSlide.href}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/12"
              >
                Xem sản phẩm nổi bật
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Free ship", value: "Đơn từ 2tr" },
              { label: "Đổi size", value: "7 ngày" },
              { label: "Thanh toán", value: "COD" },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[560px]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-[2.25rem] border border-white/10 bg-white/5"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                    rotate: [0, 1.5, 0],
                  }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute left-0 top-10 hidden rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur md:block">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Thương hiệu</p>
            <p className="mt-2 text-sm font-semibold text-white">{currentSlide.brand}</p>
          </div>

          <div className="absolute bottom-8 right-0 hidden rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur md:block">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Size có sẵn</p>
            <p className="mt-2 text-sm text-white/75">{currentSlide.meta}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -14, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[520px]"
            >
              <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-[2rem] bg-gradient-to-br from-electric-400/18 via-transparent to-volt-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/7 p-4 backdrop-blur-xl sm:p-5">
                <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_45%,transparent_70%)]" />
                <motion.div
                  animate={prefersReducedMotion ? undefined : { y: [0, -14, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative overflow-hidden rounded-[1.8rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_45%),linear-gradient(135deg,rgba(226,232,240,0.2),rgba(255,255,255,0.04))]"
                >
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.name}
                    className="h-[320px] w-full object-cover object-center sm:h-[420px]"
                  />
                </motion.div>

                <div className="relative mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                      {currentSlide.brand}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                      {currentSlide.name}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/68">
                      {currentSlide.description}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 text-right backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Giá từ</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatPrice(currentSlide.price)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-5 sm:px-8 lg:px-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/45">
            Featured rotation
          </p>
          <p className="mt-2 text-sm text-white/68">
            Điều hướng nhanh giữa các đôi nổi bật để so sánh và vào PDP ngay.
          </p>
        </div>

        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Sản phẩm nổi bật">
          {heroSlides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                aria-label={`Chọn sản phẩm nổi bật ${slide.name}`}
                className={`group flex min-w-[150px] items-center gap-3 rounded-full border px-3 py-2 text-left transition ${
                  isActive
                    ? "border-white/20 bg-white/12"
                    : "border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/8"
                }`}
              >
                <span className="overflow-hidden rounded-full bg-white/10">
                  <img src={slide.image} alt="" className="h-10 w-10 object-cover object-center" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    {slide.brand}
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium text-white/80">
                    {slide.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PremiumHero;