const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Order item name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Order item quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    image: {
      type: String,
      required: [true, "Order item image is required"],
    },
    price: {
      type: Number,
      required: [true, "Order item price is required"],
      min: [0, "Price cannot be negative"],
    },
    size: {
      type: Number,
      required: [true, "Shoe size is required"],
    },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, "Product reference is required"],
      ref: "Product",
    },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    address: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User reference is required"],
      ref: "User",
    },
    orderItems: {
      type: [orderItemSchema],
      validate: {
        validator(items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true,
      enum: {
        values: ["COD", "VNPay"],
        message: "Unsupported payment method",
      },
    },
    itemsPrice: {
      type: Number,
      required: [true, "Items price is required"],
      min: [0, "Items price cannot be negative"],
    },
    shippingPrice: {
      type: Number,
      required: [true, "Shipping price is required"],
      min: [0, "Shipping price cannot be negative"],
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", orderSchema);
