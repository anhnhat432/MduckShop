export const FREE_SHIPPING_THRESHOLD = 2000000;
export const SHIPPING_FEE = 30000;

export const getCartPricing = (cartItems = []) => {
  const normalizedItems = Array.isArray(cartItems) ? cartItems : [];

  const itemCount = normalizedItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const itemsPrice = normalizedItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const shippingPrice =
    normalizedItems.length === 0
      ? 0
      : itemsPrice >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_FEE;

  const totalPrice = itemsPrice + shippingPrice;
  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - itemsPrice,
    0
  );
  const freeShippingProgress =
    normalizedItems.length === 0
      ? 0
      : Math.min((itemsPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return {
    itemCount,
    itemsPrice,
    shippingPrice,
    totalPrice,
    remainingForFreeShipping,
    freeShippingProgress,
  };
};