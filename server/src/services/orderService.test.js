const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildValidatedOrderFromProducts,
  getRequestedProductIds,
} = require("./orderService");

const createProduct = ({
  id,
  name,
  price,
  isActive = true,
  sizes,
}) => ({
  _id: id,
  name,
  price,
  isActive,
  sizes: sizes.map((size) => ({ ...size })),
  imageUrls: [`https://example.com/${id}.jpg`],
});

test("buildValidatedOrderFromProducts reprices items from product data and merges duplicate order lines", () => {
  const products = [
    createProduct({
      id: "product-1",
      name: "Nike Air Zoom",
      price: 2100000,
      sizes: [{ size: 42, stock: 3 }],
    }),
  ];

  const rawOrderItems = [
    { product: "product-1", size: 42, quantity: 1, price: 1000 },
    { product: "product-1", size: 42, quantity: 1, price: 1000 },
  ];

  const requestedProductIds = getRequestedProductIds(rawOrderItems);
  const validatedOrder = buildValidatedOrderFromProducts(rawOrderItems, products);

  assert.deepEqual(requestedProductIds, ["product-1"]);
  assert.equal(validatedOrder.orderItems.length, 1);
  assert.equal(validatedOrder.orderItems[0].quantity, 2);
  assert.equal(validatedOrder.orderItems[0].price, 2100000);
  assert.equal(validatedOrder.itemsPrice, 4200000);
  assert.equal(validatedOrder.shippingPrice, 0);
  assert.equal(validatedOrder.totalPrice, 4200000);
  assert.equal(products[0].sizes[0].stock, 1);
});

test("buildValidatedOrderFromProducts throws conflict when stock is insufficient", () => {
  const products = [
    createProduct({
      id: "product-2",
      name: "Adidas Samba",
      price: 1800000,
      sizes: [{ size: 41, stock: 1 }],
    }),
  ];

  assert.throws(
    () =>
      buildValidatedOrderFromProducts(
        [{ product: "product-2", size: 41, quantity: 2 }],
        products
      ),
    (error) => {
      assert.equal(error.statusCode, 409);
      assert.equal(error.code, "INSUFFICIENT_STOCK");
      assert.match(error.message, /chỉ còn 1 sản phẩm/i);
      return true;
    }
  );
});
