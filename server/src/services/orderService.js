const { createHttpError } = require("../utils/httpError");

const FREE_SHIPPING_THRESHOLD = 2000000;
const SHIPPING_FEE = 30000;

const normalizeRequestedItems = (orderItems = []) => {
  const mergedItems = new Map();

  orderItems.forEach((item = {}) => {
    const productId = String(item.product || item._id || "").trim();
    const size = Number(item.size ?? item.selectedSize);
    const quantity = Number(item.quantity ?? item.qty);

    if (!productId || !Number.isInteger(size) || size <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
      throw createHttpError(400, "Dữ liệu sản phẩm đặt hàng không hợp lệ.", "INVALID_ORDER_ITEM");
    }

    const key = `${productId}:${size}`;
    const existingItem = mergedItems.get(key);

    mergedItems.set(key, {
      product: productId,
      size,
      quantity: (existingItem?.quantity || 0) + quantity,
    });
  });

  return Array.from(mergedItems.values());
};

const getRequestedProductIds = (orderItems = []) =>
  [...new Set(normalizeRequestedItems(orderItems).map((item) => item.product))];

const calculateShippingPrice = (itemsPrice) =>
  itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

const buildValidatedOrderFromProducts = (rawOrderItems = [], products = []) => {
  const requestedItems = normalizeRequestedItems(rawOrderItems);
  const productMap = new Map(
    products.map((product) => [String(product._id), product])
  );

  let itemsPrice = 0;

  const orderItems = requestedItems.map((item) => {
    const product = productMap.get(item.product);

    if (!product || !product.isActive) {
      throw createHttpError(400, "Sản phẩm không tồn tại hoặc đã ngừng bán.", "PRODUCT_UNAVAILABLE");
    }

    const sizeOption = product.sizes.find((sizeItem) => sizeItem.size === item.size);

    if (!sizeOption) {
      throw createHttpError(
        400,
        `Size ${item.size} không hợp lệ cho sản phẩm ${product.name}.`,
        "INVALID_PRODUCT_SIZE"
      );
    }

    if (sizeOption.stock < item.quantity) {
      throw createHttpError(
        409,
        `${product.name} size ${item.size} chỉ còn ${sizeOption.stock} sản phẩm.`,
        "INSUFFICIENT_STOCK"
      );
    }

    sizeOption.stock -= item.quantity;
    itemsPrice += product.price * item.quantity;

    return {
      name: product.name,
      quantity: item.quantity,
      image: product.imageUrls?.[0] || "",
      price: product.price,
      size: item.size,
      product: product._id,
    };
  });

  const shippingPrice = calculateShippingPrice(itemsPrice);

  return {
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  };
};

module.exports = {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  normalizeRequestedItems,
  getRequestedProductIds,
  calculateShippingPrice,
  buildValidatedOrderFromProducts,
};
