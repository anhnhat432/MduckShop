const { randomUUID } = require("crypto");
const morgan = require("morgan");

morgan.token("requestId", (req) => req.requestId || "-");

const attachRequestContext = (req, res, next) => {
  const inboundRequestId = req.headers["x-request-id"];
  const requestId =
    typeof inboundRequestId === "string" && inboundRequestId.trim()
      ? inboundRequestId.trim()
      : randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};

const requestLogger = morgan(
  ":requestId :method :url :status :res[content-length] - :response-time ms",
  {
    skip: () => process.env.NODE_ENV === "test",
  }
);

module.exports = {
  attachRequestContext,
  requestLogger,
};
