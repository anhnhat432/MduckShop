import assert from "node:assert/strict";
import test from "node:test";

import {
  getPaymentGuardRedirect,
  getPlaceOrderGuardRedirect,
  getShippingGuardRedirect,
} from "./checkoutGuards.js";

const cartWithItems = {
  cartItems: [{ product: "1", size: 42, quantity: 1 }],
};

test("checkout guards redirect shopper back to cart when no items exist", () => {
  assert.equal(getShippingGuardRedirect({ cartItems: [] }), "/cart");
  assert.equal(getPaymentGuardRedirect({ cartItems: [] }), "/cart");
  assert.equal(getPlaceOrderGuardRedirect({ cartItems: [] }), "/cart");
});

test("checkout guards enforce shipping step before payment and place order", () => {
  assert.equal(getShippingGuardRedirect(cartWithItems), null);
  assert.equal(getPaymentGuardRedirect(cartWithItems), "/shipping");
  assert.equal(getPlaceOrderGuardRedirect(cartWithItems), "/shipping");
});

test("place order guard requires payment method after shipping is filled", () => {
  const cart = {
    ...cartWithItems,
    shippingAddress: { address: "123 Nguyen Hue" },
  };

  assert.equal(getPaymentGuardRedirect(cart), null);
  assert.equal(getPlaceOrderGuardRedirect(cart), "/payment");
  assert.equal(
    getPlaceOrderGuardRedirect({ ...cart, paymentMethod: "COD" }),
    null
  );
});
