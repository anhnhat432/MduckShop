const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MAX_SHOPPER_PAGE_SIZE,
  buildProductCatalogQuery,
  buildProductLookupFilter,
} = require("./productCatalogService");

test("buildProductCatalogQuery keeps inactive products hidden from shopper queries and normalizes filters", () => {
  const query = buildProductCatalogQuery({
    query: {
      keyword: " Air+ ",
      brand: "Nike",
      size: "42",
      minPrice: "1000000",
      sort: "price-desc",
      limit: "999",
      page: "3",
    },
    isAdminRequest: false,
  });

  assert.deepEqual(query.baseFilter, { isActive: true });
  assert.equal(query.filter.isActive, true);
  assert.equal(query.filter.brand, "Nike");
  assert.equal(query.filter.name.$options, "i");
  assert.equal(query.filter.name.$regex, "Air\\+");
  assert.deepEqual(query.filter.sizes, {
    $elemMatch: {
      size: 42,
      stock: { $gt: 0 },
    },
  });
  assert.deepEqual(query.filter.price, { $gte: 1000000 });
  assert.equal(query.limit, MAX_SHOPPER_PAGE_SIZE);
  assert.equal(query.page, 3);
  assert.deepEqual(query.sortConfig, { price: -1, createdAt: -1 });
});

test("buildProductLookupFilter allows admin to access drafts while shoppers only see active products", () => {
  assert.deepEqual(buildProductLookupFilter({ id: "product-1", isAdminRequest: false }), {
    _id: "product-1",
    isActive: true,
  });
  assert.deepEqual(buildProductLookupFilter({ id: "product-1", isAdminRequest: true }), {
    _id: "product-1",
  });
});
