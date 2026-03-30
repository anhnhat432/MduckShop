const LOW_STOCK_THRESHOLD = 5;
const NEW_PRODUCT_WINDOW_DAYS = 30;

const parseNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const getProductDisplayPrice = (product = {}) => {
  const basePrice = parseNumber(product.price) || 0;
  const salePrice = parseNumber(product.salePrice);
  const compareAtPrice = parseNumber(product.compareAtPrice ?? product.originalPrice);

  if (salePrice !== null && salePrice >= 0 && salePrice < basePrice) {
    return {
      currentPrice: salePrice,
      compareAtPrice:
        compareAtPrice !== null && compareAtPrice > salePrice
          ? compareAtPrice
          : basePrice,
      hasSale: true,
    };
  }

  return {
    currentPrice: basePrice,
    compareAtPrice: null,
    hasSale: false,
  };
};

export const isProductNew = (product = {}) => {
  if (!product.createdAt) {
    return false;
  }

  const createdAt = new Date(product.createdAt).getTime();

  if (Number.isNaN(createdAt)) {
    return false;
  }

  return Date.now() - createdAt <= NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
};

export const getProductBadges = (product = {}) => {
  const totalStock = Number(product.stockQuantity ?? 0);
  const { hasSale } = getProductDisplayPrice(product);
  const badges = [];

  if (totalStock <= 0) {
    badges.push({ key: "sold-out", label: "Hết hàng", tone: "soldOut" });
  } else if (totalStock <= LOW_STOCK_THRESHOLD) {
    badges.push({ key: "low-stock", label: "Còn ít hàng", tone: "lowStock" });
  }

  if (isProductNew(product)) {
    badges.push({ key: "new", label: "Mới", tone: "new" });
  }

  if (hasSale) {
    badges.push({ key: "sale", label: "Giảm giá", tone: "sale" });
  }

  return badges;
};

export const getBadgeClassName = (tone = "default") => {
  switch (tone) {
    case "soldOut":
      return "bg-rose-100 text-rose-700";
    case "lowStock":
      return "bg-amber-100 text-amber-700";
    case "new":
      return "bg-sky-100 text-sky-700";
    case "sale":
      return "bg-orange-500 text-white";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const getProductStockPresentation = (stock = 0) => {
  if (stock <= 0) {
    return {
      label: "Hết hàng",
      className: "bg-rose-100 text-rose-700",
      description: "Sản phẩm này hiện đã hết hàng ở toàn bộ size.",
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: "Còn ít hàng",
      className: "bg-amber-100 text-amber-700",
      description: "Tồn kho đang thấp, nên chốt đơn sớm nếu bạn đã chọn đúng size.",
    };
  }

  return {
    label: "Còn hàng",
    className: "bg-emerald-100 text-emerald-700",
    description: "Sản phẩm đang có sẵn để đặt hàng và giao trong thời gian tiêu chuẩn.",
  };
};

export const getPrimaryProductImageAlt = (product = {}) => {
  const productName = product.name || "Sản phẩm giày";
  const brand = product.brand ? ` của ${product.brand}` : "";
  return `${productName}${brand} - ảnh chính`;
};

export const getSecondaryProductImageAlt = (product = {}) => {
  const productName = product.name || "Sản phẩm giày";
  return `${productName} - góc nhìn bổ sung`;
};
