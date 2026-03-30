const { createHttpError } = require("../utils/httpError");

const validateRequest = (validator) => (req, _res, next) => {
  try {
    const result = validator({
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user,
    });

    if (result?.body) {
      req.body = result.body;
    }

    if (result?.params) {
      req.params = result.params;
    }

    if (result?.query) {
      req.query = result.query;
    }

    return next();
  } catch (error) {
    return next(
      error.statusCode
        ? error
        : createHttpError(400, error.message || "Dữ liệu yêu cầu không hợp lệ.")
    );
  }
};

module.exports = validateRequest;
