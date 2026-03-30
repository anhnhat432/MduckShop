const { createHttpError } = require("../utils/httpError");

const DEFAULT_SERVER_ERROR_MESSAGE = "Không thể xử lý yêu cầu lúc này.";

const STATUS_CODE_TO_ERROR_CODE = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
};

const getFirstMongooseValidationMessage = (error) => {
  const validationErrors = Object.values(error.errors || {});
  return validationErrors[0]?.message || "Dữ liệu gửi lên không hợp lệ.";
};

const logError = (error, req, statusCode, publicMessage) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const payload = {
    level: statusCode >= 500 ? "error" : "warn",
    requestId: req.requestId || null,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    code: error.code || STATUS_CODE_TO_ERROR_CODE[statusCode] || "UNKNOWN_ERROR",
    message: publicMessage,
  };

  if (statusCode >= 500 && error.stack) {
    payload.stack = error.stack;
  }

  const serializedPayload = JSON.stringify(payload);

  if (statusCode >= 500) {
    console.error(serializedPayload);
    return;
  }

  console.warn(serializedPayload);
};

const notFound = (req, _res, next) => {
  next(createHttpError(404, `Route not found: ${req.originalUrl}`, "ROUTE_NOT_FOUND"));
};

const errorHandler = (error, req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || DEFAULT_SERVER_ERROR_MESSAGE;

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "JSON request body không hợp lệ.";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = getFirstMongooseValidationMessage(error);
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Dữ liệu yêu cầu không hợp lệ.";
  } else if (error.code === 11000) {
    statusCode = 400;
    message = "Dữ liệu đã tồn tại.";
  } else if (error.message === "Not allowed by CORS") {
    statusCode = 403;
    message = "Origin hiện tại không được phép truy cập API này.";
  }

  if (statusCode >= 500) {
    message = DEFAULT_SERVER_ERROR_MESSAGE;
  }

  logError(error, req, statusCode, message);

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: error.code || STATUS_CODE_TO_ERROR_CODE[statusCode] || "UNKNOWN_ERROR",
      requestId: req.requestId || null,
    },
  });
};

module.exports = {
  notFound,
  errorHandler,
};
