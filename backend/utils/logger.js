/**
 * AU Help AI
 * Logger Utility
 *
 * Centralized logging for the backend.
 *
 * Log levels:
 * - INFO
 * - WARN
 * - ERROR
 * - DEBUG
 *
 * This logger intentionally avoids logging sensitive student
 * information such as passwords, tokens, marks, payment details,
 * or private records.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const configuredLevel =
  String(process.env.LOG_LEVEL || "INFO")
    .trim()
    .toUpperCase();

const CURRENT_LEVEL =
  Object.prototype.hasOwnProperty.call(
    LOG_LEVELS,
    configuredLevel
  )
    ? LOG_LEVELS[configuredLevel]
    : LOG_LEVELS.INFO;

function getTimestamp() {
  return new Date().toISOString();
}

function formatMessage(
  level,
  message,
  meta = {}
) {
  const timestamp = getTimestamp();

  let metadata = "";

  if (
    meta &&
    typeof meta === "object" &&
    Object.keys(meta).length > 0
  ) {
    try {
      metadata =
        " " +
        JSON.stringify(
          sanitizeMetadata(meta)
        );
    } catch (error) {
      metadata = "";
    }
  }

  return `[${timestamp}] [${level}] ${message}${metadata}`;
}

/**
 * Remove potentially sensitive fields before logging.
 */
function sanitizeMetadata(meta) {
  if (
    meta === null ||
    typeof meta !== "object"
  ) {
    return meta;
  }

  if (Array.isArray(meta)) {
    return meta.map((item) =>
      sanitizeMetadata(item)
    );
  }

  const sensitiveKeys = new Set([
    "password",
    "passwd",
    "token",
    "accessToken",
    "refreshToken",
    "authorization",
    "cookie",
    "secret",
    "apiKey",
    "apikey",
    "privateKey",
    "creditCard",
    "cardNumber",
    "cvv",
    "paymentDetails",
    "marks",
    "studentMarks",
    "payment",
    "paymentAmount"
  ]);

  const result = {};

  for (const [key, value] of Object.entries(
    meta
  )) {
    if (
      sensitiveKeys.has(
        String(key)
          .trim()
          .toLowerCase()
      )
    ) {
      result[key] = "[REDACTED]";
      continue;
    }

    if (
      value &&
      typeof value === "object"
    ) {
      result[key] =
        sanitizeMetadata(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function shouldLog(level) {
  const numericLevel =
    LOG_LEVELS[level];

  if (numericLevel === undefined) {
    return false;
  }

  return numericLevel >= CURRENT_LEVEL;
}

function debug(message, meta = {}) {
  if (!shouldLog("DEBUG")) {
    return;
  }

  console.debug(
    formatMessage(
      "DEBUG",
      message,
      meta
    )
  );
}

function info(message, meta = {}) {
  if (!shouldLog("INFO")) {
    return;
  }

  console.info(
    formatMessage(
      "INFO",
      message,
      meta
    )
  );
}

function warn(message, meta = {}) {
  if (!shouldLog("WARN")) {
    return;
  }

  console.warn(
    formatMessage(
      "WARN",
      message,
      meta
    )
  );
}

function error(message, meta = {}) {
  if (!shouldLog("ERROR")) {
    return;
  }

  console.error(
    formatMessage(
      "ERROR",
      message,
      meta
    )
  );
}

function request(method, path, statusCode, durationMs) {
  info("HTTP request", {
    method,
    path,
    statusCode,
    durationMs
  });
}

function service(serviceName, operation, meta = {}) {
  debug("Service operation", {
    service: serviceName,
    operation,
    ...meta
  });
}

function source(sourceName, operation, meta = {}) {
  debug("Source operation", {
    source: sourceName,
    operation,
    ...meta
  });
}

function database(operation, meta = {}) {
  debug("Database operation", {
    operation,
    ...meta
  });
}

function cache(operation, meta = {}) {
  debug("Cache operation", {
    operation,
    ...meta
  });
}

function getLogLevel() {
  return configuredLevel;
}

function getAvailableLogLevels() {
  return Object.keys(LOG_LEVELS);
}

module.exports = {
  debug,
  info,
  warn,
  error,
  request,
  service,
  source,
  database,
  cache,
  sanitizeMetadata,
  shouldLog,
  getLogLevel,
  getAvailableLogLevels
};
