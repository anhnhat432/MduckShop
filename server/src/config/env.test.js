const test = require("node:test");
const assert = require("node:assert/strict");

const { getAllowedOrigins, loadEnvConfig } = require("./env");

test("loadEnvConfig rejects missing required environment variables", () => {
  assert.throws(
    () => loadEnvConfig({ NODE_ENV: "development" }),
    /MONGODB_URI là bắt buộc/gi
  );
});

test("loadEnvConfig returns normalized config for a valid environment", () => {
  const config = loadEnvConfig({
    NODE_ENV: "production",
    PORT: "5050",
    MONGODB_URI: "mongodb://localhost:27017/shoestore",
    JWT_SECRET: "super-secret",
    CLIENT_URLS: "https://shoestore.vn,https://www.shoestore.vn",
    SERVER_PUBLIC_URL: "https://api.shoestore.vn",
  });

  assert.equal(config.nodeEnv, "production");
  assert.equal(config.port, 5050);
  assert.equal(config.mongoUri, "mongodb://localhost:27017/shoestore");
  assert.equal(config.jwtSecret, "super-secret");
  assert.equal(config.serverPublicUrl, "https://api.shoestore.vn");
  assert.ok(config.allowedOrigins.includes("https://shoestore.vn"));
  assert.ok(config.allowedOrigins.includes("https://www.shoestore.vn"));
});

test("getAllowedOrigins keeps local dev origins by default", () => {
  const allowedOrigins = getAllowedOrigins({});

  assert.ok(allowedOrigins.includes("http://localhost:5173"));
  assert.ok(allowedOrigins.includes("http://127.0.0.1:5173"));
});
