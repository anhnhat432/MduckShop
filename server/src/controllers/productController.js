const mongoose = require("mongoose");
const Product = require("../models/Product");
const { createHttpError } = require("../utils/httpError");
const {
  buildProductCatalogQuery,
  buildProductLookupFilter,
} = require("../services/productCatalogService");

const buildSampleProduct = () => ({
  name: "New Shoe Sample",
  brand: "Brand Name",
  description: "Cap nhat mo ta san pham o man hinh Product Edit.",
  price: 0,
  sizes: [
    { size: 39, stock: 0 },
    { size: 40, stock: 0 },
  ],
  imageUrls: [
    "https://dummyimage.com/800x800/e2e8f0/0f172a&text=New+Shoe",
  ],
  isFeatured: false,
  isActive: false,
});

const getProducts = async (req, res, next) => {
  try {
    const isAdminRequest = Boolean(req.user?.isAdmin);
    const catalogQuery = buildProductCatalogQuery({
      query: req.query,
      isAdminRequest,
    });

    const totalProducts = await Product.countDocuments(catalogQuery.filter);
    const totalPages = Math.max(Math.ceil(totalProducts / catalogQuery.limit), 1);
    const currentPage = Math.min(catalogQuery.page, totalPages);
    const skip = (currentPage - 1) * catalogQuery.limit;
    const availableBrands = (
      await Product.distinct("brand", catalogQuery.baseFilter)
    )
      .filter(Boolean)
      .sort((first, second) => first.localeCompare(second, "vi"));

    const products = await Product.find(catalogQuery.filter)
      .sort(catalogQuery.sortConfig)
      .skip(skip)
      .limit(catalogQuery.limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        currentPage,
        pageSize: catalogQuery.limit,
        totalProducts,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
      filters: catalogQuery.filters,
      availableBrands,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdminRequest = Boolean(req.user?.isAdmin);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Product not found", "PRODUCT_NOT_FOUND"));
    }

    const product = await Product.findOne(
      buildProductLookupFilter({ id, isAdminRequest })
    );

    if (!product) {
      return next(createHttpError(404, "Product not found", "PRODUCT_NOT_FOUND"));
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const payload = req.body && Object.keys(req.body).length > 0
      ? req.body
      : buildSampleProduct();

    const product = await Product.create(payload);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Product not found", "PRODUCT_NOT_FOUND"));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createHttpError(404, "Product not found", "PRODUCT_NOT_FOUND"));
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Product not found", "PRODUCT_NOT_FOUND"));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createHttpError(404, "Product not found", "PRODUCT_NOT_FOUND"));
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
