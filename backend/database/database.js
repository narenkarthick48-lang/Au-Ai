/**
 * AU Help AI - Database Layer
 *
 * This module provides a small JSON-based local database layer
 * for caching public university information.
 *
 * IMPORTANT:
 * - This is NOT a private student database.
 * - Do not store passwords, OTPs, payment credentials,
 *   private academic records, or restricted portal data here.
 * - Only publicly available information or safe cache data
 *   should be stored.
 */

const fs = require("fs");
const path = require("path");


// --------------------------------------------------
// Database location
// --------------------------------------------------

const DATABASE_DIRECTORY = path.join(
  __dirname,
  "storage"
);

const DATABASE_FILE = path.join(
  DATABASE_DIRECTORY,
  "database.json"
);


// --------------------------------------------------
// Default database structure
// --------------------------------------------------

const DEFAULT_DATABASE = {
  version: 1,

  metadata: {
    name: "AU Help AI Local Database",
    type: "public-information-cache",
    createdAt: null,
    updatedAt: null
  },

  departments: [],
  programmes: [],
  staff: [],
  examinations: [],
  notices: [],
  placements: [],
  admissions: [],

  cache: {}
};


// --------------------------------------------------
// Ensure database directory exists
// --------------------------------------------------

function ensureDatabaseDirectory() {
  if (!fs.existsSync(DATABASE_DIRECTORY)) {
    fs.mkdirSync(DATABASE_DIRECTORY, {
      recursive: true
    });
  }
}


// --------------------------------------------------
// Create database if it doesn't exist
// --------------------------------------------------

function initializeDatabase() {
  ensureDatabaseDirectory();

  if (!fs.existsSync(DATABASE_FILE)) {
    const now = new Date().toISOString();

    const database = {
      ...DEFAULT_DATABASE,

      metadata: {
        ...DEFAULT_DATABASE.metadata,
        createdAt: now,
        updatedAt: now
      }
    };

    writeDatabase(database);
  }
}


// --------------------------------------------------
// Read database
// --------------------------------------------------

function readDatabase() {
  initializeDatabase();

  try {
    const fileContent = fs.readFileSync(
      DATABASE_FILE,
      "utf8"
    );

    if (!fileContent.trim()) {
      return createFreshDatabase();
    }

    const database = JSON.parse(fileContent);

    return normalizeDatabase(database);
  } catch (error) {
    console.error(
      "Database read error:",
      error.message
    );

    throw new Error(
      "Unable to read local database"
    );
  }
}


// --------------------------------------------------
// Write database
// --------------------------------------------------

function writeDatabase(database) {
  ensureDatabaseDirectory();

  const now = new Date().toISOString();

  const normalizedDatabase =
    normalizeDatabase(database);

  normalizedDatabase.metadata.updatedAt = now;

  fs.writeFileSync(
    DATABASE_FILE,
    JSON.stringify(
      normalizedDatabase,
      null,
      2
    ),
    "utf8"
  );

  return normalizedDatabase;
}


// --------------------------------------------------
// Create a fresh database
// --------------------------------------------------

function createFreshDatabase() {
  const now = new Date().toISOString();

  return {
    ...DEFAULT_DATABASE,

    metadata: {
      ...DEFAULT_DATABASE.metadata,
      createdAt: now,
      updatedAt: now
    }
  };
}


// --------------------------------------------------
// Normalize database structure
// --------------------------------------------------

function normalizeDatabase(database) {
  const source =
    database && typeof database === "object"
      ? database
      : {};

  return {
    version:
      source.version ||
      DEFAULT_DATABASE.version,

    metadata: {
      ...DEFAULT_DATABASE.metadata,
      ...(source.metadata || {})
    },

    departments: Array.isArray(
      source.departments
    )
      ? source.departments
      : [],

    programmes: Array.isArray(
      source.programmes
    )
      ? source.programmes
      : [],

    staff: Array.isArray(source.staff)
      ? source.staff
      : [],

    examinations: Array.isArray(
      source.examinations
    )
      ? source.examinations
      : [],

    notices: Array.isArray(
      source.notices
    )
      ? source.notices
      : [],

    placements: Array.isArray(
      source.placements
    )
      ? source.placements
      : [],

    admissions: Array.isArray(
      source.admissions
    )
      ? source.admissions
      : [],

    cache:
      source.cache &&
      typeof source.cache === "object"
        ? source.cache
        : {}
  };
}


// --------------------------------------------------
// Get all records from a collection
// --------------------------------------------------

function getCollection(collectionName) {
  const database = readDatabase();

  if (
    !Object.prototype.hasOwnProperty.call(
      database,
      collectionName
    )
  ) {
    throw new Error(
      `Unknown database collection: ${collectionName}`
    );
  }

  const collection =
    database[collectionName];

  if (!Array.isArray(collection)) {
    throw new Error(
      `Database collection is not an array: ${collectionName}`
    );
  }

  return collection;
}


// --------------------------------------------------
// Replace an entire collection
// --------------------------------------------------

function setCollection(
  collectionName,
  records
) {
  if (!Array.isArray(records)) {
    throw new Error(
      "Database collection data must be an array"
    );
  }

  const database = readDatabase();

  if (
    !Object.prototype.hasOwnProperty.call(
      database,
      collectionName
    )
  ) {
    throw new Error(
      `Unknown database collection: ${collectionName}`
    );
  }

  database[collectionName] = records;

  writeDatabase(database);

  return records;
}


// --------------------------------------------------
// Add one record to a collection
// --------------------------------------------------

function addRecord(
  collectionName,
  record
) {
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    throw new Error(
      "Database record must be an object"
    );
  }

  const database = readDatabase();

  if (
    !Object.prototype.hasOwnProperty.call(
      database,
      collectionName
    )
  ) {
    throw new Error(
      `Unknown database collection: ${collectionName}`
    );
  }

  if (!Array.isArray(database[collectionName])) {
    throw new Error(
      `Database collection is not an array: ${collectionName}`
    );
  }

  database[collectionName].push(record);

  writeDatabase(database);

  return record;
}


// --------------------------------------------------
// Find one record by ID
// --------------------------------------------------

function findById(
  collectionName,
  id
) {
  const collection =
    getCollection(collectionName);

  if (
    id === null ||
    id === undefined ||
    String(id).trim() === ""
  ) {
    return null;
  }

  const searchId =
    String(id).trim().toLowerCase();

  return (
    collection.find((record) => {
      if (
        !record ||
        typeof record !== "object"
      ) {
        return false;
      }

      return (
        String(record.id || "")
          .trim()
          .toLowerCase() === searchId
      );
    }) || null
  );
}


// --------------------------------------------------
// Search a collection
// --------------------------------------------------

function searchCollection(
  collectionName,
  keyword,
  fields = []
) {
  const collection =
    getCollection(collectionName);

  const searchTerm =
    String(keyword || "")
      .trim()
      .toLowerCase();

  if (!searchTerm) {
    return collection;
  }

  return collection.filter((record) => {
    if (
      !record ||
      typeof record !== "object"
    ) {
      return false;
    }

    /*
     * If specific fields are supplied,
     * search only those fields.
     */
    if (fields.length > 0) {
      return fields.some((field) => {
        const value = record[field];

        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        return String(value)
          .toLowerCase()
          .includes(searchTerm);
      });
    }

    /*
     * Otherwise search the entire record.
     */
    return JSON.stringify(record)
      .toLowerCase()
      .includes(searchTerm);
  });
}


// --------------------------------------------------
// Delete a record by ID
// --------------------------------------------------

function deleteById(
  collectionName,
  id
) {
  const database = readDatabase();

  if (
    !Object.prototype.hasOwnProperty.call(
      database,
      collectionName
    )
  ) {
    throw new Error(
      `Unknown database collection: ${collectionName}`
    );
  }

  const collection =
    database[collectionName];

  if (!Array.isArray(collection)) {
    throw new Error(
      `Database collection is not an array: ${collectionName}`
    );
  }

  const searchId =
    String(id || "")
      .trim()
      .toLowerCase();

  const originalLength =
    collection.length;

  database[collectionName] =
    collection.filter((record) => {
      return (
        String(record.id || "")
          .trim()
          .toLowerCase() !== searchId
      );
    });

  const deleted =
    database[collectionName].length <
    originalLength;

  if (deleted) {
    writeDatabase(database);
  }

  return deleted;
}


// --------------------------------------------------
// Cache helpers
// --------------------------------------------------

function setCache(
  key,
  value,
  expiresAt = null
) {
  const database = readDatabase();

  database.cache[key] = {
    value,
    expiresAt,
    updatedAt: new Date().toISOString()
  };

  writeDatabase(database);

  return database.cache[key];
}


function getCache(key) {
  const database = readDatabase();

  const item =
    database.cache[key];

  if (!item) {
    return null;
  }

  if (
    item.expiresAt &&
    new Date(item.expiresAt) <= new Date()
  ) {
    delete database.cache[key];

    writeDatabase(database);

    return null;
  }

  return item.value;
}


function deleteCache(key) {
  const database = readDatabase();

  if (
    Object.prototype.hasOwnProperty.call(
      database.cache,
      key
    )
  ) {
    delete database.cache[key];

    writeDatabase(database);

    return true;
  }

  return false;
}


// --------------------------------------------------
// Database statistics
// --------------------------------------------------

function getDatabaseStats() {
  const database = readDatabase();

  return {
    version: database.version,

    collections: {
      departments:
        database.departments.length,

      programmes:
        database.programmes.length,

      staff:
        database.staff.length,

      examinations:
        database.examinations.length,

      notices:
        database.notices.length,

      placements:
        database.placements.length,

      admissions:
        database.admissions.length
    },

    cacheEntries:
      Object.keys(database.cache).length,

    createdAt:
      database.metadata.createdAt,

    updatedAt:
      database.metadata.updatedAt
  };
}


// --------------------------------------------------
// Clear all cached data
// --------------------------------------------------

function clearCache() {
  const database = readDatabase();

  database.cache = {};

  writeDatabase(database);

  return true;
}


// --------------------------------------------------
// Export functions
// --------------------------------------------------

module.exports = {
  DATABASE_DIRECTORY,
  DATABASE_FILE,

  initializeDatabase,
  readDatabase,
  writeDatabase,

  createFreshDatabase,
  normalizeDatabase,

  getCollection,
  setCollection,
  addRecord,
  findById,
  searchCollection,
  deleteById,

  setCache,
  getCache,
  deleteCache,

  getDatabaseStats,
  clearCache
};
