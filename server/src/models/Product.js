const mongoose = require("mongoose");

const { Schema } = mongoose;

const sizeOptionSchema = new Schema(
  {
    size: {
      type: Number,
      required: [true, "Size is required"],
      min: [35, "Size must be at least 35"],
      max: [50, "Size must be at most 50"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required for each size"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [160, "Product name cannot exceed 160 characters"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [80, "Brand cannot exceed 80 characters"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    sizes: {
      type: [sizeOptionSchema],
      validate: {
        validator(sizes) {
          if (!sizes || sizes.length === 0) {
            return false;
          }

          const uniqueSizes = new Set(sizes.map((item) => item.size));
          return uniqueSizes.size === sizes.length;
        },
        message: "Sizes are required and cannot contain duplicates",
      },
    },
    stockQuantity: {
      type: Number,
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    imageUrls: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator(images) {
          return (
            Array.isArray(images) &&
            images.length > 0 &&
            images.every((url) => /^https?:\/\/.+/i.test(url))
          );
        },
        message: "imageUrls must contain valid HTTP/HTTPS URLs",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.pre("validate", function syncStockQuantity(next) {
  if (Array.isArray(this.sizes) && this.sizes.length > 0) {
    this.stockQuantity = this.sizes.reduce(
      (total, sizeOption) => total + sizeOption.stock,
      0
    );
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
