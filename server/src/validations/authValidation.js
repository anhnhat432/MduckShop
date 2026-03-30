const { createHttpError } = require("../utils/httpError");

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const assert = (condition, message) => {
  if (!condition) {
    throw createHttpError(400, message);
  }
};

const validateLoginInput = ({ body = {} }) => {
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  assert(email, "Email là bắt buộc.");
  assert(EMAIL_REGEX.test(email), "Email không hợp lệ.");
  assert(password, "Mật khẩu là bắt buộc.");

  return {
    body: {
      email,
      password,
    },
  };
};

const validateRegisterInput = ({ body = {} }) => {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  assert(name, "Họ và tên là bắt buộc.");
  assert(name.length <= 80, "Họ và tên không được vượt quá 80 ký tự.");
  assert(email, "Email là bắt buộc.");
  assert(EMAIL_REGEX.test(email), "Email không hợp lệ.");
  assert(password.length >= 6, "Mật khẩu phải có ít nhất 6 ký tự.");
  assert(password.length <= 72, "Mật khẩu quá dài.");

  return {
    body: {
      name,
      email,
      password,
    },
  };
};

module.exports = {
  validateLoginInput,
  validateRegisterInput,
};
