export const PRODUCT_PAGE_SIZE = 12;
export const DEFAULT_SORT_VALUE = "newest";

export const PRODUCT_SORT_OPTIONS = [
  { value: DEFAULT_SORT_VALUE, label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

export const PRODUCT_PRICE_OPTIONS = [
  {
    value: "",
    label: "Tất cả mức giá",
    minPrice: null,
    maxPrice: null,
  },
  {
    value: "under-1000000",
    label: "Dưới 1.000.000đ",
    minPrice: null,
    maxPrice: 999999,
  },
  {
    value: "1000000-2000000",
    label: "1.000.000đ - 2.000.000đ",
    minPrice: 1000000,
    maxPrice: 2000000,
  },
  {
    value: "over-2000000",
    label: "Trên 2.000.000đ",
    minPrice: 2000001,
    maxPrice: null,
  },
];

export const PRODUCT_SIZE_OPTIONS = Array.from(
  { length: 16 },
  (_, index) => 35 + index
);

export const DEFAULT_PRODUCT_CATALOG_FILTERS = {
  keyword: "",
  brand: "",
  price: "",
  size: "",
  sort: DEFAULT_SORT_VALUE,
  page: 1,
};

const normalizePage = (value) => {
  const parsedPage = Number(value);
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

export const resolvePriceRange = (value) =>
  PRODUCT_PRICE_OPTIONS.find((option) => option.value === value) ||
  PRODUCT_PRICE_OPTIONS[0];

export const parseProductCatalogSearchParams = (searchParams) => {
  const sort = searchParams.get("sort") || DEFAULT_SORT_VALUE;
  const size = searchParams.get("size") || "";
  const price = searchParams.get("price") || "";

  return {
    keyword: (searchParams.get("keyword") || "").trim(),
    brand: (searchParams.get("brand") || "").trim(),
    price,
    size,
    sort: PRODUCT_SORT_OPTIONS.some((option) => option.value === sort)
      ? sort
      : DEFAULT_SORT_VALUE,
    page: normalizePage(searchParams.get("page")),
  };
};

export const buildProductCatalogSearchParams = (filters) => {
  const params = new URLSearchParams();

  if (filters.keyword?.trim()) {
    params.set("keyword", filters.keyword.trim());
  }

  if (filters.brand) {
    params.set("brand", filters.brand);
  }

  if (filters.price) {
    params.set("price", filters.price);
  }

  if (filters.size) {
    params.set("size", String(filters.size));
  }

  if (filters.sort && filters.sort !== DEFAULT_SORT_VALUE) {
    params.set("sort", filters.sort);
  }

  if ((filters.page || 1) > 1) {
    params.set("page", String(filters.page));
  }

  return params;
};

export const buildProductCatalogApiParams = (filters) => {
  const priceRange = resolvePriceRange(filters.price);
  const params = {
    page: normalizePage(filters.page),
    limit: PRODUCT_PAGE_SIZE,
    sort: filters.sort || DEFAULT_SORT_VALUE,
  };

  if (filters.keyword?.trim()) {
    params.keyword = filters.keyword.trim();
  }

  if (filters.brand) {
    params.brand = filters.brand;
  }

  if (filters.size) {
    params.size = Number(filters.size);
  }

  if (priceRange.minPrice !== null) {
    params.minPrice = priceRange.minPrice;
  }

  if (priceRange.maxPrice !== null) {
    params.maxPrice = priceRange.maxPrice;
  }

  return params;
};

export const getPaginationRange = (currentPage, totalPages) => {
  if (totalPages <= 1) {
    return [1];
  }

  const pages = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  return pages;
};
