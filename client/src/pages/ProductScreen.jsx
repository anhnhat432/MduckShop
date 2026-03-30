import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, getProducts } from "../api/productService";
import EmptyStateCard from "../components/EmptyStateCard";
import ImageLightbox from "../components/ImageLightbox";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import TrustBar from "../components/TrustBar";
import { useStore } from "../context/StoreContext";
import usePageMeta from "../hooks/usePageMeta";
import { getApiErrorMessage } from "../utils/apiError";
import { FREE_SHIPPING_THRESHOLD } from "../utils/cartPricing";
import { formatPrice } from "../utils/formatPrice";
import {
  getBadgeClassName,
  getProductBadges,
  getProductDisplayPrice,
  getPrimaryProductImageAlt,
  getProductStockPresentation,
  getSecondaryProductImageAlt,
} from "../utils/productPresentation";

const productTrustItems = [
  {
    icon: "shipping",
    label: "Giao hàng tiêu chuẩn 2-4 ngày",
    description: "Miễn phí với đơn từ 2.000.000đ và hỗ trợ COD toàn quốc.",
  },
  {
    icon: "returns",
    label: "Đổi size trong 7 ngày",
    description: "Phù hợp cho shopper cần kiểm tra lại form chân sau khi nhận hàng.",
  },
  {
    icon: "authentic",
    label: "Thông tin minh bạch",
    description: "Giá bán, tồn kho theo size và trạng thái sản phẩm được hiển thị rõ.",
  },
  {
    icon: "support",
    label: "Hỗ trợ chọn size nhanh",
    description: "Có bảng hướng dẫn cơ bản và hỗ trợ nếu bạn chưa chắc size.",
  },
];

const supportBlocks = [
  {
    title: "Hướng dẫn chọn size",
    body: "Đo chiều dài bàn chân vào cuối ngày để chọn size chính xác hơn. Nếu thường mang tất dày hoặc form chân bè, hãy cân nhắc tăng nửa đến một size.",
    bullets: [
      "Ưu tiên đối chiếu với đôi giày bạn đang mang vừa chân nhất.",
      "Nếu lưng bàn chân cao, hãy chọn form rộng hoặc tăng size.",
      "Liên hệ shop nếu bạn muốn được gợi ý nhanh theo chiều dài chân.",
    ],
  },
  {
    title: "Thông tin giao hàng",
    body: "Đơn nội thành thường được xử lý trong 24 giờ và giao đến trong 2-4 ngày làm việc tùy khu vực.",
    bullets: [
      `Miễn phí giao hàng cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`,
      "COD có sẵn để giảm rủi ro cho đơn mua đầu tiên.",
      "Bạn sẽ nhận được cập nhật trạng thái sau khi đơn được xác nhận.",
    ],
  },
  {
    title: "Chính sách đổi trả",
    body: "ShoeStore hỗ trợ đổi size trong 7 ngày nếu sản phẩm chưa qua sử dụng và còn đầy đủ hộp, tem, phụ kiện.",
    bullets: [
      "Không áp dụng cho sản phẩm đã qua sử dụng hoặc thiếu phụ kiện.",
      "Giữ lại hộp giày để quá trình đổi size nhanh hơn.",
      "Đội ngũ hỗ trợ sẽ hướng dẫn từng bước nếu bạn cần xử lý sau mua.",
    ],
  },
];

function ProductScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  usePageMeta({
    title: product ? product.name : "Chi tiết sản phẩm",
    description:
      product?.description ||
      "Xem chi tiết sản phẩm, chọn size phù hợp và thêm nhanh vào giỏ hàng trên ShoeStore.",
    image: product?.imageUrls?.[0],
    type: "product",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchRelatedProducts = async (currentProduct) => {
      try {
        setRelatedLoading(true);
        const sameBrandResponse = await getProducts({
          brand: currentProduct.brand,
          limit: 5,
          sort: "newest",
        });
        let nextRelatedProducts = (sameBrandResponse.data || [])
          .filter((item) => item._id !== currentProduct._id)
          .slice(0, 4);

        if (nextRelatedProducts.length === 0) {
          const latestResponse = await getProducts({ limit: 5, sort: "newest" });
          nextRelatedProducts = (latestResponse.data || [])
            .filter((item) => item._id !== currentProduct._id)
            .slice(0, 4);
        }

        if (isMounted) {
          setRelatedProducts(nextRelatedProducts);
        }
      } catch (_error) {
        if (isMounted) {
          setRelatedProducts([]);
        }
      } finally {
        if (isMounted) {
          setRelatedLoading(false);
        }
      }
    };

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setSelectedSize(null);
        setQuantity(1);
        setRelatedProducts([]);
        setActiveImageIndex(0);
        setIsLightboxOpen(false);

        const nextProduct = await getProductById(id);

        if (!isMounted) {
          return;
        }

        setProduct(nextProduct);
        fetchRelatedProducts(nextProduct);
      } catch (err) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              err,
              "Không thể tải chi tiết sản phẩm. Vui lòng thử lại."
            )
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const totalStock = product?.stockQuantity ?? product?.countInStock ?? 0;
  const selectedSizeData =
    product?.sizes?.find((item) => item.size === selectedSize) || null;
  const activeStock = selectedSizeData?.stock ?? totalStock;
  const stockPresentation = useMemo(
    () => getProductStockPresentation(activeStock),
    [activeStock]
  );
  const displayPrice = useMemo(
    () => getProductDisplayPrice(product || {}),
    [product]
  );
  const productBadges = useMemo(
    () => getProductBadges(product || {}),
    [product]
  );
  const images = useMemo(() => {
    const nextImages = Array.isArray(product?.imageUrls)
      ? product.imageUrls.filter(Boolean)
      : [];

    return nextImages.length
      ? nextImages
      : ["https://dummyimage.com/1200x1400/e5e7eb/0f172a&text=ShoeStore"];
  }, [product]);
  const savings = displayPrice.compareAtPrice
    ? displayPrice.compareAtPrice - displayPrice.currentPrice
    : 0;
  const isOutOfStock = !product || totalStock <= 0;
  const canAddToCart =
    !!selectedSizeData && selectedSizeData.stock > 0 && !isOutOfStock;

  useEffect(() => {
    if (!selectedSizeData) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(Math.max(currentQuantity, 1), selectedSizeData.stock)
    );
  }, [selectedSizeData]);

  const handleAddToCart = () => {
    if (!canAddToCart) {
      return;
    }

    addToCart({
      product: product._id,
      name: product.name,
      image: product.imageUrls?.[0] || images[0],
      price: displayPrice.currentPrice,
      size: selectedSizeData.size,
      quantity,
      stock: selectedSizeData.stock,
    });

    navigate("/cart");
  };

  const increaseQuantity = () => {
    if (!selectedSizeData) {
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(currentQuantity + 1, selectedSizeData.stock)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(currentQuantity - 1, 1));
  };

  if (loading) {
    return (
      <section className="page-shell py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-card overflow-hidden p-5 sm:p-6">
              <div className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-slate-100" />
            </div>
            <div className="surface-card p-6 sm:p-8">
              <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-4 h-12 w-4/5 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-4 h-8 w-40 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-8 space-y-3">
                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-14 w-full animate-pulse rounded-full bg-slate-100" />
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
        <div className="mx-auto max-w-3xl">
          <EmptyStateCard
            eyebrow="Không thể hiển thị PDP"
            title="Sản phẩm này hiện chưa khả dụng"
            description={error}
            actionLabel="Quay lại danh mục"
            actionTo="/products"
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-shell py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="transition hover:text-slate-950">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/products" className="transition hover:text-slate-950">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="max-w-[240px] truncate font-medium text-slate-950">
              {product?.name}
            </span>
          </nav>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
            <div className="space-y-4">
              <div className="surface-card overflow-hidden p-4 sm:p-5">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)]">
                  <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                    {productBadges.map((badge) => (
                      <span
                        key={badge.key}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClassName(
                          badge.tone
                        )}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute right-4 top-4 z-10 rounded-full border border-white/60 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft backdrop-blur transition hover:bg-white"
                    aria-label="Phóng to ảnh sản phẩm"
                  >
                    Phóng to
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="flex min-h-[360px] w-full items-center justify-center p-6 sm:min-h-[520px] sm:p-10"
                    aria-label="Mở lightbox ảnh sản phẩm"
                  >
                    <img
                      src={images[activeImageIndex] || images[0]}
                      alt={getPrimaryProductImageAlt(product || {})}
                      className="h-full max-h-[520px] w-full object-contain drop-shadow-[0_26px_60px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${product?._id || "image"}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`surface-muted h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.15rem] border-2 p-1 transition ${
                      activeImageIndex === index
                        ? "border-orange-500 ring-4 ring-orange-100"
                        : "border-transparent hover:border-slate-300"
                    }`}
                    aria-label={`Xem ảnh sản phẩm ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                  >
                    <img
                      src={image}
                      alt={getSecondaryProductImageAlt(product || {})}
                      className="h-full w-full rounded-[0.9rem] object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="xl:sticky xl:top-28">
              <div className="surface-card p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="info-chip bg-slate-950 text-white">{product?.brand}</span>
                  <span className={`info-chip border-0 ${stockPresentation.className}`}>
                    {stockPresentation.label}
                  </span>
                  {displayPrice.hasSale && savings > 0 && (
                    <span className="info-chip border-orange-200 bg-orange-50 text-orange-700">
                      Tiết kiệm {formatPrice(savings)}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {product?.name}
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {product?.description ||
                    "Thiết kế hướng đến cảm giác mang ổn định, dễ phối đồ và đủ rõ ràng về size lẫn tồn kho để bạn quyết định nhanh hơn."}
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-3">
                  <p className="text-3xl font-black tracking-tight text-orange-600 sm:text-4xl">
                    {formatPrice(displayPrice.currentPrice)}
                  </p>
                  {displayPrice.compareAtPrice && (
                    <p className="pb-1 text-base font-semibold text-slate-400 line-through sm:text-lg">
                      {formatPrice(displayPrice.compareAtPrice)}
                    </p>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {stockPresentation.description}
                </p>

                {activeStock > 0 && activeStock <= 5 && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                    Chỉ còn {activeStock} đôi cho lựa chọn hiện tại. Nếu đúng size, bạn nên thêm vào giỏ sớm.
                  </div>
                )}

                <div className="soft-divider my-6" />

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="label-field mb-0">Chọn size</label>
                    <button
                      type="button"
                      className="text-sm font-semibold text-orange-600 hover:text-orange-500"
                    >
                      Xem gợi ý size
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {product?.sizes?.map((sizeOption) => {
                      const isSelected = selectedSize === sizeOption.size;
                      const isDisabled = sizeOption.stock <= 0;

                      return (
                        <button
                          key={sizeOption.size}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setSelectedSize(sizeOption.size)}
                          aria-pressed={isSelected}
                          aria-label={`Chọn size ${sizeOption.size}${
                            isDisabled ? ", hết hàng" : `, còn ${sizeOption.stock} đôi`
                          }`}
                          className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white shadow-soft"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                          } ${
                            isDisabled
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                              : ""
                          }`}
                        >
                          {sizeOption.size}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSizeData ? (
                    <p className="mt-3 text-sm text-slate-500">
                      Size {selectedSizeData.size} hiện còn {selectedSizeData.stock} đôi.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      Chọn size để xem tồn kho chính xác và mở nút mua hàng.
                    </p>
                  )}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
                  <div>
                    <label className="label-field mb-0">Số lượng</label>
                    <div className="mt-3 inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-soft">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={!selectedSizeData || quantity <= 1}
                        aria-label="Giảm số lượng"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        -
                      </button>
                      <span className="inline-flex min-w-12 items-center justify-center text-base font-bold text-slate-950">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={!selectedSizeData || quantity >= (selectedSizeData?.stock || 0)}
                        aria-label="Tăng số lượng"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className="btn-primary w-full py-4 text-base"
                  >
                    {canAddToCart
                      ? `Thêm vào giỏ hàng - ${formatPrice(
                          displayPrice.currentPrice * quantity
                        )}`
                      : isOutOfStock
                        ? "Sản phẩm đang hết hàng"
                        : "Chọn size để tiếp tục"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="info-chip">Miễn phí ship từ {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                  <span className="info-chip">Đổi size 7 ngày</span>
                  <span className="info-chip">Hỗ trợ COD</span>
                  <span className="info-chip">Chính hãng 100%</span>
                </div>
              </div>
            </div>
          </div>

          <TrustBar items={productTrustItems} />

          <section className="grid gap-4 lg:grid-cols-3">
            {supportBlocks.map((block) => (
              <article key={block.title} className="surface-card p-6">
                <p className="section-eyebrow">Shopper support</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                  {block.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{block.body}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                  {block.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          {(relatedLoading || relatedProducts.length > 0) && (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="You may also like"
                title="Gợi ý thêm cho bạn"
                description="Các sản phẩm cùng brand hoặc mới lên kệ giúp shopper tiếp tục khám phá mà không phải quay lại từ đầu."
                actionLabel="Xem tất cả sản phẩm"
                actionTo="/products"
              />

              {relatedLoading ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={`related-skeleton-${index}`} className="surface-card p-4">
                      <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-slate-100" />
                      <div className="mt-5 space-y-3">
                        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                        <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-100" />
                        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {relatedProducts.map((item) => (
                    <ProductCard key={item._id} product={item} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950">{product?.name}</p>
              <p className="text-lg font-black text-orange-600">
                {formatPrice(displayPrice.currentPrice)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="btn-primary min-w-[150px] px-4 py-3 text-sm"
            >
              {canAddToCart ? "Thêm vào giỏ" : "Chọn size"}
            </button>
          </div>
        </div>
        <div className="h-20 lg:hidden" />
      </section>

      <ImageLightbox
        open={isLightboxOpen}
        images={images}
        activeIndex={activeImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setActiveImageIndex}
        alt={getPrimaryProductImageAlt(product || {})}
      />
    </>
  );
}

export default ProductScreen;