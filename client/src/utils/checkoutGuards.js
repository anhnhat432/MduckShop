export const getShippingGuardRedirect = (cart = {}) =>
  (cart.cartItems || []).length === 0 ? "/cart" : null;

export const getPaymentGuardRedirect = (cart = {}) => {
  if ((cart.cartItems || []).length === 0) {
    return "/cart";
  }

  if (!cart.shippingAddress?.address) {
    return "/shipping";
  }

  return null;
};

export const getPlaceOrderGuardRedirect = (cart = {}) => {
  const paymentRedirect = getPaymentGuardRedirect(cart);

  if (paymentRedirect) {
    return paymentRedirect;
  }

  if (!cart.paymentMethod) {
    return "/payment";
  }

  return null;
};
