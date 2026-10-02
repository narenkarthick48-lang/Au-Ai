/**
 * AU Help AI - Database Schema
 *
 * Defines the structure expected for public AU information
 * stored by the local database/cache layer.
 *
 * IMPORTANT:
 * This schema is for public information only.
 * It must not be used to store passwords, OTPs, payment
 * credentials, private student records, or restricted data.
 */


/**
 * Current schema version.
 */
const SCHEMA_VERSION = 1;


/**
 * Common fields for public AU records.
 */
const COMMON_FIELDS = {
  id: "string",
  name: "string",
  title: "string",
  source: "string",
  sourceUrl: "string",
  lastUpdated: "string"
};


/**
 * Department record schema.
 */
const DEPARTMENT_SCHEMA = {
  ...COMMON_FIELDS,

  code: "string",
  faculty: "string",
  description: "string"
};


/**
 * Programme record schema.
 */
const PROGRAMME_SCHEMA = {
  ...COMMON_FIELDS,

  code: "string",
  programme: "string",
  department: "string",
  faculty: "string",
  level: "string",
  duration: "string",
  eligibility: "string"
};


/**
 * Staff record schema.
 */
const STAFF_SCHEMA = {
  ...COMMON_FIELDS,

  designation: "string",
  department: "string",
  faculty: "string",
  profileUrl: "string"
};


/**
 * Examination record schema.
 */
const EXAMINATION_SCHEMA = {
  ...COMMON_FIELDS,

  examination: "string",
  programme: "string",
  semester: "string",
  academicYear: "string",
  examDate: "string",
  timetableUrl: "string"
};


/**
 * Notice record schema.
 */
const NOTICE_SCHEMA = {
  ...COMMON_FIELDS,

  category: "string",
  date: "string",
  content: "string",
  noticeUrl: "string"
};


/**
 * Placement record schema.
 */
const PLACEMENT_SCHEMA = {
  ...COMMON_FIELDS,

  academicYear: "string",
  department: "string",
  company: "string",
  description: "string",
  sourceUrl: "string"
};


/**
 * Admission record schema.
 */
const ADMISSION_SCHEMA = {
  ...COMMON_FIELDS,

  programme: "string",
  level: "string",
  academicYear: "string",
  eligibility: "string",
  applicationStart: "string",
  applicationEnd: "string",
  applicationUrl: "string"
};


/**
 * Collection names supported by the database.
 */
const COLLECTIONS = {
  DEPARTMENTS: "departments",
  PROGRAMMES: "programmes",
  STAFF: "staff",
  EXAMINATIONS: "examinations",
  NOTICES: "notices",
  PLACEMENTS: "placements",
  ADMISSIONS: "admissions"
};


/**
 * Get the schema for a collection.
 *
 * @param {string} collectionName
 * @returns {Object|null}
 */
function getSchema(collectionName) {
  const schemas = {
    departments: DEPARTMENT_SCHEMA,
    programmes: PROGRAMME_SCHEMA,
    staff: STAFF_SCHEMA,
    examinations: EXAMINATION_SCHEMA,
    notices: NOTICE_SCHEMA,
    placements: PLACEMENT_SCHEMA,
    admissions: ADMISSION_SCHEMA
  };

  return schemas[collectionName] || null;
}


/**
 * Check whether a collection name is supported.
 *
 * @param {string} collectionName
 * @returns {boolean}
 */
function isValidCollection(collectionName) {
  return Boolean(
    getSchema(collectionName)
  );
}


/**
 * Validate a record against the basic schema.
 *
 * This performs structural validation only.
 * It does not claim that the information itself
 * is genuine or officially verified.
 *
 * @param {string} collectionName
 * @param {Object} record
 * @returns {Object}
 */
function validateRecord(
  collectionName,
  record
) {
  const schema =
    getSchema(collectionName);

  if (!schema) {
    return {
      valid: false,
      errors: [
        `Unknown collection: ${collectionName}`
      ]
    };
  }

  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    return {
      valid: false,
      errors: [
        "Record must be an object"
      ]
    };
  }

  const errors = [];

  /*
   * Validate fields only when they are present.
   * This allows incomplete public records while
   * source data is being normalized.
   */
  for (const [field, expectedType] of Object.entries(
    schema
  )) {
    if (
      record[field] === undefined ||
      record[field] === null
    ) {
      continue;
    }

    if (
      expectedType === "string" &&
      typeof record[field] !== "string"
    ) {
      errors.push(
        `${field} must be a string`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Validate a complete collection.
 *
 * @param {string} collectionName
 * @param {Array} records
 * @returns {Object}
 */
function validateCollection(
  collectionName,
  records
) {
  if (!Array.isArray(records)) {
    return {
      valid: false,
      errors: [
        "Collection must be an array"
      ]
    };
  }

  const errors = [];

  records.forEach((record, index) => {
    const result =
      validateRecord(
        collectionName,
        record
      );

    if (!result.valid) {
      errors.push({
        index,
        errors: result.errors
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Create an empty database structure
 * based on the current schema.
 *
 * @returns {Object}
 */
function createEmptyDatabase() {
  return {
    version: SCHEMA_VERSION,

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
}


/**
 * Return all supported collection names.
 *
 * @returns {Array<string>}
 */
function getCollections() {
  return Object.values(COLLECTIONS);
}


module.exports = {
  SCHEMA_VERSION,

  COMMON_FIELDS,

  DEPARTMENT_SCHEMA,
  PROGRAMME_SCHEMA,
  STAFF_SCHEMA,
  EXAMINATION_SCHEMA,
  NOTICE_SCHEMA,
  PLACEMENT_SCHEMA,
  ADMISSION_SCHEMA,

  COLLECTIONS,

  getSchema,
  isValidCollection,

  validateRecord,
  validateCollection,

  createEmptyDatabase,
  getCollections
};
