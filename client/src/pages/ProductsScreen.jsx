import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyStateCard from "../components/EmptyStateCard";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import TrustBar from "../components/TrustBar";
import usePageMeta from "../hooks/usePageMeta";
import useProductCatalog from "../hooks/useProductCatalog";
import {
  buildProductCatalogSearchParams,
  DEFAULT_PRODUCT_CATALOG_FILTERS,
  getPaginationRange,
  parseProductCatalogSearchParams,
  PRODUCT_PRICE_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_SORT_OPTIONS,
} from "../utils/productCatalog";

const filterTrustItems = [
  {
    icon: "size",
    label: "Lọc theo size thật",
    description: "Ưu tiên các mẫu đang còn size bạn cần.",
  },
  {
    icon: "shipping",
    label: "Giao nhanh toàn quốc",
    description: "Đơn từ 2.000.000đ được miễn phí giao hàng.",
  },
  {
    icon: "returns",
    label: "Đổi size sau mua",
    description: "Hỗ trợ đổi size trong 7 ngày nếu cần.",
  },
  {
    icon: "authentic",
    label: "Thông tin minh bạch",
    description: "Badge hàng mới, sale và tồn kho hiển thị rõ.",
  },
];

function ProductsScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => parseProductCatalogSearchParams(searchParams),
    [searchParams]
  );
  const { products, pagination, availableBrands, loading, error } =
    useProductCatalog(filters);
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  usePageMeta({
    title: filters.keyword ? `Tìm kiếm: ${filters.keyword}` : "Sản phẩm",
    description: filters.keyword
      ? `Kết quả tìm kiếm cho "${filters.keyword}" trên ShoeStore.`
      : "Khám phá bộ sưu tập giày theo thương hiệu, mức giá và size trên ShoeStore.",
  });

  useEffect(() => {
    setKeywordInput(filters.keyword);
  }, [filters.keyword]);

  useEffect(() => {
    if (!loading && pagination.currentPage !== filters.page) {
      setSearchParams(
        buildProductCatalogSearchParams({
          ...filters,
          page: pagination.currentPage,
        }),
        { replace: true }
      );
    }
  }, [filters, loading, pagination.currentPage, setSearchParams]);

  useEffect(() => {
    setMobileFiltersOpen(false);
  }, [searchParams.toString()]);

  const paginationRange = useMemo(
    () => getPaginationRange(pagination.currentPage, pagination.totalPages),
    [pagination.currentPage, pagination.totalPages]
  );

  const selectedPriceOption = useMemo(
    () =>
      PRODUCT_PRICE_OPTIONS.find((option) => option.value === filters.price) ||
      PRODUCT_PRICE_OPTIONS[0],
    [filters.price]
  );

  const activeFilters = useMemo(
    () =>
      [
        filters.keyword
          ? { key: "keyword", label: `Từ khóa: ${filters.keyword}` }
          : null,
        filters.brand
          ? { key: "brand", label: `Thương hiệu: ${filters.brand}` }
          : null,
        filters.price
          ? { key: "price", label: selectedPriceOption.label }
          : null,
        filters.size ? { key: "size", label: `Size ${filters.size}` } : null,
      ].filter(Boolean),
    [
      filters.brand,
      filters.keyword,
      filters.price,
      filters.size,
      selectedPriceOption.label,
    ]
  );

  const updateFilters = (overrides, options = {}) => {
    const nextFilters = {
      ...filters,
      ...overrides,
      page: options.keepPage ? overrides.page || filters.page : 1,
    };

    if (options.keepPage) {
      nextFilters.page = overrides.page || filters.page;
    }

    setSearchParams(buildProductCatalogSearchParams(nextFilters));
  };

  const clearSingleFilter = (key) => {
    if (key === "keyword") {
      setKeywordInput("");
    }

    updateFilters({ [key]: "" });
  };

  const submitSearchHandler = (event) => {
    event.preventDefault();
    updateFilters({ keyword: keywordInput.trim() });
  };

  const resetFilters = () => {
    setKeywordInput("");
    setSearchParams(
      buildProductCatalogSearchParams(DEFAULT_PRODUCT_CATALOG_FILTERS)
    );
  };

  const resultDescription = loading
    ? "Đang tải sản phẩm..."
    : filters.keyword
      ? `${pagination.totalProducts} kết quả cho "${filters.keyword}"`
      : `${pagination.totalProducts} sản phẩm sẵn sàng để mua`;

  const filterPanelContent = (
    <div className="space-y-5">
      <div>
        <label htmlFor="product-brand" className="label-field">
          Thương hiệu
        </label>
        <select
          id="product-brand"
          value={filters.brand}
          onChange={(event) => updateFilters({ brand: event.target.value })}
          className="input-field"
        >
          <option value="">Tất cả thương hiệu</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="product-price" className="label-field">
          Khoảng giá
        </label>
        <select
          id="product-price"
          value={filters.price}
          onChange={(event) => updateFilters({ price: event.target.value })}
          className="input-field"
        >
          {PRODUCT_PRICE_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="product-size" className="label-field">
          Size
        </label>
        <select
          id="product-size"
          value={filters.size}
          onChange={(event) => updateFilters({ size: event.target.value })}
          className="input-field"
        >
          <option value="">Tất cả size</option>
          {PRODUCT_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              Size {size}
            </option>
          ))}
        </select>
      </div>

      <div className="surface-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Gợi ý nhanh
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Nếu bạn đã biết size mình mang, hãy lọc theo size trước rồi dùng sort giá để ra quyết định nhanh hơn.
        </p>
      </div>

      {activeFilters.length > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="btn-ghost w-full justify-center"
        >
          Xóa toàn bộ bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <section className="page-shell py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="surface-card overflow-hidden p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="section-eyebrow">Product listing</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Chọn đúng đôi nhanh hơn với bộ lọc rõ ràng và thông tin vừa đủ.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Trang danh mục được tối ưu để shopper nhìn thấy ngay thương hiệu, mức giá, badge tồn kho và các lựa chọn size trước khi quyết định vào trang chi tiết.
              </p>

              <form
                onSubmit={submitSearchHandler}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <div className="flex-1">
                  <label htmlFor="product-keyword" className="sr-only">
                    Tìm sản phẩm
                  </label>
                  <input
                    id="product-keyword"
                    type="search"
                    value={keywordInput}
                    onChange={(event) => setKeywordInput(event.target.value)}
                    placeholder="Tìm theo tên hoặc dòng sản phẩm"
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-secondary px-6">
                  Tìm kiếm
                </button>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Kết quả hiện có
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {loading ? "..." : pagination.totalProducts}
                </p>
                <p className="mt-1 text-sm text-slate-600">Sản phẩm đang active trên storefront.</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Thương hiệu
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {availableBrands.length}
                </p>
                <p className="mt-1 text-sm text-slate-600">Được gom tự động từ catalog đang bán.</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Sort mặc định
                </p>
                <p className="mt-2 text-lg font-bold tracking-tight text-slate-950">
                  Mới nhất
                </p>
                <p className="mt-1 text-sm text-slate-600">Ưu tiên sản phẩm mới lên kệ để tạo cảm giác cập nhật.</p>
              </div>
            </div>
          </div>
        </div>

        <TrustBar items={filterTrustItems} compact className="lg:grid-cols-4" />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="hidden lg:block lg:sticky lg:top-28">
            <div className="surface-card p-6">
              <SectionHeading
                eyebrow="Filters"
                title="Bộ lọc"
                description="Tinh gọn để shopper thay đổi nhanh mà không rối trên desktop."
                align="start"
              />
              <div className="mt-6">{filterPanelContent}</div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="surface-card p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600" aria-live="polite">
                    {resultDescription}
                    {!loading && pagination.totalPages > 1 && (
                      <span className="ml-2 text-xs text-slate-400">
                        Trang {pagination.currentPage}/{pagination.totalPages}
                      </span>
                    )}
                  </p>

                  {activeFilters.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeFilters.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => clearSingleFilter(item.key)}
                          className="info-chip border-orange-200 bg-orange-50 text-orange-700"
                        >
                          {item.label}
                          <span aria-hidden="true">x</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="btn-ghost w-full justify-center lg:hidden"
                    aria-expanded={mobileFiltersOpen}
                    aria-controls="mobile-filters-dialog"
                  >
                    Bộ lọc {activeFilters.length > 0 ? `(${activeFilters.length})` : ""}
                  </button>

                  <div className="w-full sm:w-56">
                    <label htmlFor="product-sort" className="sr-only">
                      Sắp xếp sản phẩm
                    </label>
                    <select
                      id="product-sort"
                      value={filters.sort}
                      onChange={(event) => updateFilters({ sort: event.target.value })}
                      className="input-field py-3"
                    >
                      {PRODUCT_SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`catalog-skeleton-${index}`} className="surface-card overflow-hidden p-4">
                    <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-slate-100" />
                    <div className="mt-5 space-y-3">
                      <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyStateCard
                eyebrow="Không có kết quả"
                title="Bộ lọc hiện tại chưa tìm thấy đôi phù hợp"
                description="Thử nới rộng khoảng giá, bỏ filter size hoặc tìm theo tên dòng sản phẩm khác để xem thêm lựa chọn."
                actionLabel="Xóa bộ lọc"
                onAction={resetFilters}
              />
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="surface-card px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={!pagination.hasPrevPage}
                        onClick={() =>
                          updateFilters(
                            { page: pagination.currentPage - 1 },
                            { keepPage: true }
                          )
                        }
                        className="btn-ghost px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Trang trước"
                      >
                        Trước
                      </button>

                      {paginationRange.map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => updateFilters({ page }, { keepPage: true })}
                          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                            page === pagination.currentPage
                              ? "bg-slate-950 text-white shadow-soft"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950"
                          }`}
                          aria-label={`Trang ${page}`}
                          aria-current={page === pagination.currentPage ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={!pagination.hasNextPage}
                        onClick={() =>
                          updateFilters(
                            { page: pagination.currentPage + 1 },
                            { keepPage: true }
                          )
                        }
                        className="btn-ghost px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Trang sau"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filters-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Đóng bộ lọc"
          />
          <div
            id="mobile-filters-dialog"
            className="absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-[2rem] bg-white px-5 pb-6 pt-5 shadow-premium"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow">Mobile filters</p>
                <h2
                  id="mobile-filters-title"
                  className="mt-2 text-xl font-bold tracking-tight text-slate-950"
                >
                  Lọc sản phẩm nhanh
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
                aria-label="Đóng bộ lọc"
              >
                x
              </button>
            </div>
            <div className="mt-6">{filterPanelContent}</div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              Xem {pagination.totalProducts} sản phẩm
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductsScreen;