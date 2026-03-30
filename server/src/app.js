const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const securityHeaders = require("./middleware/securityHeaders");
const { attachRequestContext, requestLogger } = require("./middleware/requestContext");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { getAllowedOrigins } = require("./config/env");

const DB_READY_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const allowedOrigins = getAllowedOrigins();
const uploadsPath = path.join(__dirname, "..", "uploads");

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
};

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(attachRequestContext);
app.use(securityHeaders);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(requestLogger);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(
  "/uploads",
  express.static(uploadsPath, {
    etag: true,
    maxAge: "1d",
  })
);

app.get("/api/health", (req, res) => {
  const readyState = mongoose.connection.readyState;
  const isHealthy = readyState === 1;
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isHealthy,
    message: isHealthy ? "Shoe ecommerce API is healthy" : "Shoe ecommerce API is degraded",
    data: {
      status: isHealthy ? "ok" : "degraded",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      database: {
        readyState,
        state: DB_READY_STATE_LABELS[readyState] || "unknown",
      },
      requestId: req.requestId || null,
    },
  });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
