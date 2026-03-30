const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { createHttpError } = require("../utils/httpError");
const {
  buildValidatedOrderFromProducts,
  getRequestedProductIds,
} = require("../services/orderService");

const addOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { shippingAddress, paymentMethod, orderItems: rawOrderItems } = req.body;
    let createdOrder;

    await session.withTransaction(async () => {
      const productIds = getRequestedProductIds(rawOrderItems);
      const products = await Product.find({
        _id: { $in: productIds },
        isActive: true,
      }).session(session);

      const {
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
      } = buildValidatedOrderFromProducts(rawOrderItems, products);

      for (const product of products) {
        await product.save({ session });
      }

      [createdOrder] = await Order.create(
        [
          {
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
          },
        ],
        { session }
      );
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    return next(error);
  } finally {
    await session.endSession();
  }
};

const getOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email isAdmin")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Order not found", "ORDER_NOT_FOUND"));
    }

    const order = await Order.findById(id)
      .populate("user", "name email isAdmin")
      .populate("orderItems.product", "name brand imageUrls");

    if (!order) {
      return next(createHttpError(404, "Order not found", "ORDER_NOT_FOUND"));
    }

    const isOwner = order.user?._id?.toString() === req.user._id.toString();

    if (!isOwner && !req.user.isAdmin) {
      return next(
        createHttpError(403, "Not authorized to view this order", "FORBIDDEN")
      );
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

const deliverOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Order not found", "ORDER_NOT_FOUND"));
    }

    const order = await Order.findById(id).populate("user", "name email isAdmin");

    if (!order) {
      return next(createHttpError(404, "Order not found", "ORDER_NOT_FOUND"));
    }

    if (order.isDelivered) {
      return next(
        createHttpError(
          400,
          "Order has already been marked as delivered",
          "ORDER_ALREADY_DELIVERED"
        )
      );
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      data: updatedOrder,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrderById,
  deliverOrder,
};
