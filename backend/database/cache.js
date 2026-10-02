/**
 * AU Help AI - Cache Layer
 *
 * This module manages temporary cached copies of
 * verified public AU information.
 *
 * IMPORTANT:
 * - Cache is for public information only.
 * - Do not cache passwords, OTPs, private student records,
 *   payment credentials, or restricted portal information.
 */

const database = require("./database");


// --------------------------------------------------
// Default cache duration
// --------------------------------------------------

const DEFAULT_TTL_SECONDS = 60 * 30; // 30 minutes


// --------------------------------------------------
// Create an expiration timestamp
// --------------------------------------------------

function createExpiry(ttlSeconds) {
  const ttl =
    Number.isFinite(Number(ttlSeconds)) &&
    Number(ttlSeconds) >= 0
      ? Number(ttlSeconds)
      : DEFAULT_TTL_SECONDS;

  return new Date(
    Date.now() + ttl * 1000
  ).toISOString();
}


// --------------------------------------------------
// Validate cache key
// --------------------------------------------------

function validateKey(key) {
  const value = String(key || "").trim();

  if (!value) {
    throw new Error(
      "Cache key is required"
    );
  }

  if (value.length > 200) {
    throw new Error(
      "Cache key is too long"
    );
  }

  return value;
}


// --------------------------------------------------
// Store data in cache
// --------------------------------------------------

function set(
  key,
  value,
  ttlSeconds = DEFAULT_TTL_SECONDS
) {
  const cacheKey = validateKey(key);

  if (value === undefined) {
    throw new Error(
      "Cache value cannot be undefined"
    );
  }

  const expiresAt =
    createExpiry(ttlSeconds);

  database.setCache(
    cacheKey,
    value,
    expiresAt
  );

  return {
    key: cacheKey,
    expiresAt,
    value
  };
}


// --------------------------------------------------
// Get data from cache
// --------------------------------------------------

function get(key) {
  const cacheKey = validateKey(key);

  return database.getCache(
    cacheKey
  );
}


// --------------------------------------------------
// Check whether a cache entry exists
// --------------------------------------------------

function has(key) {
  const cacheKey = validateKey(key);

  const value =
    database.getCache(cacheKey);

  return value !== null &&
    value !== undefined;
}


// --------------------------------------------------
// Remove one cache entry
// --------------------------------------------------

function remove(key) {
  const cacheKey = validateKey(key);

  return database.deleteCache(
    cacheKey
  );
}


// --------------------------------------------------
// Clear every cache entry
// --------------------------------------------------

function clear() {
  return database.clearCache();
}


// --------------------------------------------------
// Get cache statistics
// --------------------------------------------------

function getStats() {
  const stats =
    database.getDatabaseStats();

  return {
    cacheEntries:
      stats.cacheEntries,

    databaseUpdatedAt:
      stats.updatedAt
  };
}


// --------------------------------------------------
// Get data or fetch it if not cached
// --------------------------------------------------

async function getOrSet(
  key,
  fetchFunction,
  ttlSeconds = DEFAULT_TTL_SECONDS
) {
  const cacheKey = validateKey(key);

  if (
    typeof fetchFunction !== "function"
  ) {
    throw new Error(
      "fetchFunction must be a function"
    );
  }

  /*
   * Check existing cached data first.
   */
  const cached =
    database.getCache(cacheKey);

  if (
    cached !== null &&
    cached !== undefined
  ) {
    return {
      data: cached,
      cached: true
    };
  }


  /*
   * No valid cache entry exists.
   * Fetch fresh public information.
   */
  const freshData =
    await fetchFunction();


  /*
   * Never cache undefined data.
   */
  if (freshData === undefined) {
    return {
      data: null,
      cached: false
    };
  }


  /*
   * Store the fresh result.
   */
  set(
    cacheKey,
    freshData,
    ttlSeconds
  );

  return {
    data: freshData,
    cached: false
  };
}


// --------------------------------------------------
// Create standard cache keys
// --------------------------------------------------

function createKey(
  category,
  identifier = ""
) {
  const safeCategory =
    String(category || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const safeIdentifier =
    String(identifier || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  if (!safeCategory) {
    throw new Error(
      "Cache category is required"
    );
  }

  if (!safeIdentifier) {
    return `au:${safeCategory}`;
  }

  return `au:${safeCategory}:${safeIdentifier}`;
}


// --------------------------------------------------
// Public-information specific helpers
// --------------------------------------------------

async function getPublicData(
  category,
  fetchFunction,
  ttlSeconds = DEFAULT_TTL_SECONDS
) {
  const key =
    createKey(category);

  return getOrSet(
    key,
    fetchFunction,
    ttlSeconds
  );
}


async function getPublicDataById(
  category,
  identifier,
  fetchFunction,
  ttlSeconds = DEFAULT_TTL_SECONDS
) {
  const key =
    createKey(
      category,
      identifier
    );

  return getOrSet(
    key,
    fetchFunction,
    ttlSeconds
  );
}


// --------------------------------------------------
// Common cache durations
// --------------------------------------------------

const CACHE_DURATIONS = {
  SHORT: 5 * 60,          // 5 minutes
  MEDIUM: 30 * 60,         // 30 minutes
  LONG: 2 * 60 * 60,       // 2 hours
  DAILY: 24 * 60 * 60       // 24 hours
};


// --------------------------------------------------
// Export cache functions
// --------------------------------------------------

module.exports = {
  DEFAULT_TTL_SECONDS,
  CACHE_DURATIONS,

  set,
  get,
  has,
  remove,
  clear,
  getStats,

  getOrSet,

  createKey,

  getPublicData,
  getPublicDataById
};
