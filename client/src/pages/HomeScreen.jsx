import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productService";
import EmptyStateCard from "../components/EmptyStateCard";
import PremiumHero from "../components/PremiumHero";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import TrustBar from "../components/TrustBar";
import usePageMeta from "../hooks/usePageMeta";
import { getApiErrorMessage } from "../utils/apiError";

const trustItems = [
  {
    icon: "shipping",
    label: "Giao nhanh toàn quốc",
    description: "Miễn phí vận chuyển cho đơn từ 2.000.000đ và hỗ trợ COD.",
  },
  {
    icon: "returns",
    label: "Đổi size 7 ngày",
    description: "Shopper yên tâm hơn khi cần đổi size sau khi nhận hàng.",
  },
  {
    icon: "authentic",
    label: "Thông tin rõ ràng",
    description: "Tồn kho theo size, trạng thái sản phẩm và giá được hiển thị minh bạch.",
  },
  {
    icon: "support",
    label: "Dễ chọn đúng đôi",
    description: "PDP tối ưu cho việc xem ảnh, chọn size và thêm vào giỏ nhanh.",
  },
];

const shopperIntents = [
  {
    title: "Mới về hôm nay",
    description: "Ưu tiên các mẫu vừa lên kệ để shopper khám phá nhanh ngay từ trang chủ.",
    to: "/products?sort=newest",
    label: "Xem mới về",
  },
  {
    title: "Dễ chốt đơn",
    description: "Các mẫu dễ phối, dễ mang và có nhiều size sẵn để đi thẳng đến bước mua hàng.",
    to: "/products",
    label: "Khám phá ngay",
  },
  {
    title: "Quà an toàn",
    description: "CTA rõ ràng, trust signals mạnh và flow checkout gọn cho lần mua đầu tiên.",
    to: "/products?price=1000000-2000000",
    label: "Xem tầm giá tốt",
  },
];

function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageMeta({
    title: "Trang chủ",
    description:
      "Khám phá các mẫu giày mới, dễ chọn size, giao nhanh toàn quốc và checkout mượt trên ShoeStore.",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({ limit: 8, sort: "newest" });

        if (isMounted) {
          setProducts(data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, "Không thể tải bộ sưu tập lúc này."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
    const curated = products.filter((product) => product.isFeatured);
    return curated.length ? curated : products;
  }, [products]);

  const heroSlides = useMemo(
    () =>
      featuredProducts.slice(0, 3).map((product, index) => ({
        id: product._id,
        eyebrow: index === 0 ? "Bộ sưu tập mới" : `Nổi bật 0${index + 1}`,
        brand: product.brand,
        name: product.name,
        description:
          product.description ||
          "Thiết kế hiện đại, dễ phối đồ và đủ rõ ràng về giá, size và tình trạng tồn kho để shopper quyết định nhanh hơn.",
        price: product.price,
        image:
          product.imageUrls?.[0] ||
          "https://dummyimage.com/1200x1200/e5e7eb/0f172a&text=Shoe",
        href: `/product/${product._id}`,
        meta: `Sizes ${product.sizes?.map((item) => item.size).join(" - ") || "39 - 44"}`,
      })),
    [featuredProducts]
  );

  const featuredGrid = useMemo(() => featuredProducts.slice(0, 4), [featuredProducts]);
  const newArrivals = useMemo(() => products.slice(0, 4), [products]);

  return (
    <div className="page-shell py-6 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-14">
        <PremiumHero slides={heroSlides} loading={loading} />

        <TrustBar items={trustItems} />

        <section className="grid gap-4 md:grid-cols-3">
          {shopperIntents.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="surface-card group p-6 transition hover:-translate-y-1 hover:shadow-premium"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Gợi ý mua nhanh
              </p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition group-hover:gap-3">
                {item.label}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>

        <section id="collection" className="space-y-6">
          <SectionHeading
            eyebrow="Storefront picks"
            title="Những đôi đáng xem đầu tiên"
            description="Tập hợp các mẫu nổi bật để shopper nhìn ra ngay lựa chọn mạnh, giá bán và trạng thái hàng trước khi đi sâu vào PDP."
            actionLabel="Xem tất cả"
            actionTo="/products"
          />

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`home-skeleton-${index}`} className="surface-card overflow-hidden p-4">
                  <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-slate-100" />
                  <div className="mt-5 space-y-3">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredGrid.length === 0 ? (
            <EmptyStateCard
              icon="👟"
              eyebrow="Storefront trống"
              title="Hiện chưa có sản phẩm để trưng bày"
              description="Sau khi sản phẩm được thêm và kích hoạt trong admin, khu vực này sẽ tự động hiển thị những đôi nổi bật đầu tiên."
              actionLabel="Xem danh mục"
              actionTo="/products"
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredGrid.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="New arrivals"
            title="Mới lên kệ, dễ chốt nhanh"
            description="Các mẫu mới giúp homepage luôn có cảm giác cập nhật và tạo lý do để shopper tiếp tục lướt xuống thay vì thoát trang."
            actionLabel="Khám phá /products"
            actionTo="/products?sort=newest"
          />

          {newArrivals.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={`new-${product._id}`} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-premium sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                Conversion booster
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Một homepage tốt phải giúp shopper đi nhanh sang bước chọn size.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                Hero tập trung vào lợi ích, card sản phẩm nhấn mạnh giá và trạng thái hàng, còn trust signals tạo cảm giác yên tâm để shopper tiếp tục vào PDP và thêm vào giỏ.
              </p>
            </div>
            <Link to="/products" className="btn-primary">
              Mua sắm ngay
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomeScreen;