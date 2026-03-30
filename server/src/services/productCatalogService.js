const DEFAULT_PAGE_SIZE = 12;
const MAX_SHOPPER_PAGE_SIZE = 24;
const MAX_ADMIN_PAGE_SIZE = 1000;
const SORT_MAP = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1, createdAt: -1 },
  "price-desc": { price: -1, createdAt: -1 },
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const normalizePage = (value) => {
  const parsedPage = parseInt(value, 10);
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

const normalizeLimit = (value, isAdminRequest) => {
  const parsedLimit = parseInt(value, 10);
  const maxLimit = isAdminRequest ? MAX_ADMIN_PAGE_SIZE : MAX_SHOPPER_PAGE_SIZE;

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(parsedLimit, maxLimit);
};

const normalizeSort = (value) => (SORT_MAP[value] ? value : "newest");

const buildProductLookupFilter = ({ id, isAdminRequest = false }) =>
  isAdminRequest ? { _id: id } : { _id: id, isActive: true };

const buildProductCatalogQuery = ({ query = {}, isAdminRequest = false }) => {
  const page = normalizePage(query.page);
  const limit = normalizeLimit(query.limit, isAdminRequest);
  const keyword = (query.keyword || "").trim();
  const brand = (query.brand || "").trim();
  const size = normalizeNumber(query.size);
  const minPrice = normalizeNumber(query.minPrice);
  const maxPrice = normalizeNumber(query.maxPrice);
  const sort = normalizeSort(query.sort);

  const baseFilter = isAdminRequest ? {} : { isActive: true };
  const filter = { ...baseFilter };

  if (keyword) {
    filter.name = {
      $regex: escapeRegex(keyword),
      $options: "i",
    };
  }

  if (brand) {
    filter.brand = brand;
  }

  if (Number.isInteger(size) && size > 0) {
    filter.sizes = {
      $elemMatch: {
        size,
        stock: { $gt: 0 },
      },
    };
  }

  if (minPrice !== null || maxPrice !== null) {
    filter.price = {};

    if (minPrice !== null) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== null) {
      filter.price.$lte = maxPrice;
    }
  }

  return {
    page,
    limit,
    sort,
    sortConfig: SORT_MAP[sort],
    baseFilter,
    filter,
    filters: {
      keyword,
      brand,
      size: Number.isInteger(size) && size > 0 ? size : null,
      minPrice,
      maxPrice,
      sort,
    },
  };
};

module.exports = {
  DEFAULT_PAGE_SIZE,
  MAX_SHOPPER_PAGE_SIZE,
  MAX_ADMIN_PAGE_SIZE,
  SORT_MAP,
  buildProductCatalogQuery,
  buildProductLookupFilter,
};
