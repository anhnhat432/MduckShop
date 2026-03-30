const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const ALLOWED_NODE_ENVS = new Set(["development", "test", "production"]);

const parseOriginList = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_error) {
    return false;
  }
};

const getAllowedOrigins = (env = process.env) => {
  const configuredOrigins = [env.CLIENT_URL, env.CLIENT_URLS]
    .filter(Boolean)
    .flatMap(parseOriginList)
    .filter(isValidHttpUrl);

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins])];
};

const parsePort = (value, errors) => {
  if (!value) {
    return 5000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    errors.push("PORT phải là số nguyên từ 1 đến 65535.");
    return 5000;
  }

  return port;
};

const loadEnvConfig = (env = process.env) => {
  const errors = [];
  const nodeEnv = env.NODE_ENV || "development";

  if (!ALLOWED_NODE_ENVS.has(nodeEnv)) {
    errors.push("NODE_ENV phải là development, test hoặc production.");
  }

  if (!env.MONGODB_URI?.trim()) {
    errors.push("MONGODB_URI là bắt buộc.");
  }

  if (!env.JWT_SECRET?.trim()) {
    errors.push("JWT_SECRET là bắt buộc.");
  }

  if (env.SERVER_PUBLIC_URL && !isValidHttpUrl(env.SERVER_PUBLIC_URL)) {
    errors.push("SERVER_PUBLIC_URL phải là URL http/https hợp lệ nếu được khai báo.");
  }

  const invalidOrigins = [env.CLIENT_URL, env.CLIENT_URLS]
    .filter(Boolean)
    .flatMap(parseOriginList)
    .filter((origin) => !isValidHttpUrl(origin));

  if (invalidOrigins.length > 0) {
    errors.push("CLIENT_URL/CLIENT_URLS chỉ được chứa các URL http/https hợp lệ.");
  }

  const port = parsePort(env.PORT, errors);

  if (errors.length > 0) {
    throw new Error(`Cấu hình môi trường không hợp lệ:\n- ${errors.join("\n- ")}`);
  }

  return {
    nodeEnv,
    port,
    mongoUri: env.MONGODB_URI,
    jwtSecret: env.JWT_SECRET,
    allowedOrigins: getAllowedOrigins(env),
    serverPublicUrl: env.SERVER_PUBLIC_URL || "",
  };
};

module.exports = {
  DEFAULT_ALLOWED_ORIGINS,
  getAllowedOrigins,
  loadEnvConfig,
};
