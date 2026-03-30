const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sendAuthError = (res, req, statusCode, message, code) =>
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      requestId: req.requestId || null,
    },
  });

const resolveUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id).select("-password");
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return sendAuthError(
        res,
        req,
        401,
        "Không được phép truy cập tài nguyên này.",
        "UNAUTHORIZED"
      );
    }

    const token = authHeader.split(" ")[1];
    const user = await resolveUserFromToken(token);

    if (!user) {
      return sendAuthError(
        res,
        req,
        401,
        "Không được phép truy cập tài nguyên này.",
        "UNAUTHORIZED"
      );
    }

    req.user = user;
    return next();
  } catch (_error) {
    return sendAuthError(
      res,
      req,
      401,
      "Không được phép truy cập tài nguyên này.",
      "UNAUTHORIZED"
    );
  }
};

const optionalProtect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const user = await resolveUserFromToken(token);

    req.user = user || null;
  } catch (_error) {
    req.user = null;
  }

  return next();
};

const admin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Bạn không có quyền truy cập tính năng này.",
    error: {
      code: "FORBIDDEN",
      requestId: req.requestId || null,
    },
  });
};

module.exports = {
  protect,
  optionalProtect,
  admin,
};
