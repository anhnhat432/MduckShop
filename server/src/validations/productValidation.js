const { createHttpError } = require("../utils/httpError");

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const assert = (condition, message) => {
  if (!condition) {
    throw createHttpError(400, message);
  }
};

const normalizeBoolean = (value, fieldLabel) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw createHttpError(400, `${fieldLabel} phải là kiểu boolean.`);
};

const normalizeImageUrls = (imageUrls) => {
  if (Array.isArray(imageUrls)) {
    return imageUrls
      .map((url) => String(url || "").trim())
      .filter(Boolean);
  }

  if (typeof imageUrls === "string" && imageUrls.trim()) {
    return [imageUrls.trim()];
  }

  return [];
};

const normalizeSizes = (sizes) => {
  assert(Array.isArray(sizes) && sizes.length > 0, "Phải có ít nhất một size hợp lệ.");

  const normalizedSizes = sizes.map((item) => ({
    size: Number(item?.size),
    stock: Number(item?.stock),
  }));

  normalizedSizes.forEach((item) => {
    assert(Number.isInteger(item.size), "Size phải là số nguyên hợp lệ.");
    assert(item.size >= 35 && item.size <= 50, "Size phải nằm trong khoảng 35-50.");
    assert(Number.isInteger(item.stock) && item.stock >= 0, "Tồn kho size phải là số nguyên không âm.");
  });

  const uniqueSizes = new Set(normalizedSizes.map((item) => item.size));
  assert(uniqueSizes.size === normalizedSizes.length, "Danh sách size không được trùng lặp.");

  return normalizedSizes;
};

const validateCreateProductInput = ({ body = {} }) => {
  if (!body || Object.keys(body).length === 0) {
    return { body: {} };
  }

  const name = String(body.name || "").trim();
  const brand = String(body.brand || "").trim();
  const description = String(body.description || "").trim();
  const price = Number(body.price);
  const sizes = normalizeSizes(body.sizes);
  const imageUrls = normalizeImageUrls(body.imageUrls);

  assert(name, "Tên sản phẩm là bắt buộc.");
  assert(name.length <= 160, "Tên sản phẩm không được vượt quá 160 ký tự.");
  assert(brand, "Hãng là bắt buộc.");
  assert(brand.length <= 80, "Hãng không được vượt quá 80 ký tự.");
  assert(description.length <= 2000, "Mô tả không được vượt quá 2000 ký tự.");
  assert(Number.isFinite(price) && price >= 0, "Giá sản phẩm không hợp lệ.");
  assert(imageUrls.length > 0, "Phải có ít nhất một ảnh sản phẩm hợp lệ.");

  return {
    body: {
      name,
      brand,
      description,
      price,
      sizes,
      imageUrls,
      isFeatured: hasOwn(body, "isFeatured")
        ? normalizeBoolean(body.isFeatured, "isFeatured")
        : false,
      isActive: hasOwn(body, "isActive")
        ? normalizeBoolean(body.isActive, "isActive")
        : true,
    },
  };
};

const validateUpdateProductInput = ({ body = {} }) => {
  assert(body && Object.keys(body).length > 0, "Không có dữ liệu để cập nhật sản phẩm.");

  const nextBody = {};

  if (hasOwn(body, "name")) {
    const name = String(body.name || "").trim();
    assert(name, "Tên sản phẩm là bắt buộc.");
    assert(name.length <= 160, "Tên sản phẩm không được vượt quá 160 ký tự.");
    nextBody.name = name;
  }

  if (hasOwn(body, "brand")) {
    const brand = String(body.brand || "").trim();
    assert(brand, "Hãng là bắt buộc.");
    assert(brand.length <= 80, "Hãng không được vượt quá 80 ký tự.");
    nextBody.brand = brand;
  }

  if (hasOwn(body, "description")) {
    const description = String(body.description || "").trim();
    assert(description.length <= 2000, "Mô tả không được vượt quá 2000 ký tự.");
    nextBody.description = description;
  }

  if (hasOwn(body, "price")) {
    const price = Number(body.price);
    assert(Number.isFinite(price) && price >= 0, "Giá sản phẩm không hợp lệ.");
    nextBody.price = price;
  }

  if (hasOwn(body, "sizes")) {
    nextBody.sizes = normalizeSizes(body.sizes);
  }

  if (hasOwn(body, "imageUrls")) {
    const imageUrls = normalizeImageUrls(body.imageUrls);
    assert(imageUrls.length > 0, "Phải có ít nhất một ảnh sản phẩm hợp lệ.");
    nextBody.imageUrls = imageUrls;
  }

  if (hasOwn(body, "isFeatured")) {
    nextBody.isFeatured = normalizeBoolean(body.isFeatured, "isFeatured");
  }

  if (hasOwn(body, "isActive")) {
    nextBody.isActive = normalizeBoolean(body.isActive, "isActive");
  }

  return {
    body: nextBody,
  };
};

module.exports = {
  validateCreateProductInput,
  validateUpdateProductInput,
};
