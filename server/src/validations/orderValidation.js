const mongoose = require("mongoose");
const { createHttpError } = require("../utils/httpError");

const SUPPORTED_PAYMENT_METHODS = ["COD", "VNPay"];

const assert = (condition, message) => {
  if (!condition) {
    throw createHttpError(400, message);
  }
};

const validateCreateOrderInput = ({ body = {} }) => {
  const shippingAddress = {
    address: String(body.shippingAddress?.address || "").trim(),
    city: String(body.shippingAddress?.city || "").trim(),
    phoneNumber: String(body.shippingAddress?.phoneNumber || "").trim(),
  };
  const paymentMethod = String(body.paymentMethod || "").trim();

  assert(
    Array.isArray(body.orderItems) && body.orderItems.length > 0,
    "Giỏ hàng đang trống hoặc dữ liệu đơn hàng không hợp lệ."
  );
  assert(shippingAddress.address, "Địa chỉ giao hàng là bắt buộc.");
  assert(shippingAddress.city, "Thành phố là bắt buộc.");
  assert(shippingAddress.phoneNumber, "Số điện thoại là bắt buộc.");
  assert(
    SUPPORTED_PAYMENT_METHODS.includes(paymentMethod),
    "Phương thức thanh toán không hợp lệ."
  );

  const orderItems = body.orderItems.map((item) => {
    const product = String(item?.product || item?._id || "").trim();
    const size = Number(item?.size ?? item?.selectedSize);
    const quantity = Number(item?.quantity ?? item?.qty);

    assert(mongoose.Types.ObjectId.isValid(product), "Sản phẩm trong đơn hàng không hợp lệ.");
    assert(Number.isInteger(size) && size > 0, "Size sản phẩm không hợp lệ.");
    assert(Number.isInteger(quantity) && quantity > 0, "Số lượng sản phẩm không hợp lệ.");

    return {
      product,
      size,
      quantity,
    };
  });

  return {
    body: {
      orderItems,
      shippingAddress,
      paymentMethod,
    },
  };
};

module.exports = {
  validateCreateOrderInput,
};
