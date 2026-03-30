import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProductCatalogApiParams,
  buildProductCatalogSearchParams,
  DEFAULT_SORT_VALUE,
  parseProductCatalogSearchParams,
} from "./productCatalog.js";

test("product catalog query params preserve shopper search/filter/sort state", () => {
  const searchParams = buildProductCatalogSearchParams({
    keyword: " Nike Air ",
    brand: "Nike",
    price: "over-2000000",
    size: 42,
    sort: "price-desc",
    page: 3,
  });

  assert.equal(searchParams.get("keyword"), "Nike Air");
  assert.equal(searchParams.get("brand"), "Nike");
  assert.equal(searchParams.get("price"), "over-2000000");
  assert.equal(searchParams.get("size"), "42");
  assert.equal(searchParams.get("sort"), "price-desc");
  assert.equal(searchParams.get("page"), "3");

  const parsedFilters = parseProductCatalogSearchParams(searchParams);
  const apiParams = buildProductCatalogApiParams(parsedFilters);

  assert.deepEqual(parsedFilters, {
    keyword: "Nike Air",
    brand: "Nike",
    price: "over-2000000",
    size: "42",
    sort: "price-desc",
    page: 3,
  });
  assert.deepEqual(apiParams, {
    keyword: "Nike Air",
    brand: "Nike",
    size: 42,
    minPrice: 2000001,
    page: 3,
    limit: 12,
    sort: "price-desc",
  });
});

test("product catalog query params fall back to defaults for invalid values", () => {
  const parsedFilters = parseProductCatalogSearchParams(
    new URLSearchParams("sort=unknown&page=-5")
  );

  assert.equal(parsedFilters.sort, DEFAULT_SORT_VALUE);
  assert.equal(parsedFilters.page, 1);
});
