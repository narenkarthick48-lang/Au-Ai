/**
 * AU Help AI - Data Normalization Utilities
 *
 * Converts public AU data into a consistent format
 * before it is sent to services, cache, or frontend.
 *
 * This module does not create or invent information.
 */


/**
 * Convert any value to a safe trimmed string.
 *
 * @param {*} value
 * @returns {string}
 */
function cleanString(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/\s+/g, " ")
    .trim();
}


/**
 * Normalize a field name.
 *
 * Example:
 * "Department Name" -> "departmentName"
 *
 * @param {string} field
 * @returns {string}
 */
function normalizeFieldName(field) {
  return cleanString(field)
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, character) =>
      character.toUpperCase()
    );
}


/**
 * Normalize an object.
 *
 * @param {Object} object
 * @returns {Object}
 */
function normalizeObject(object) {
  if (
    !object ||
    typeof object !== "object" ||
    Array.isArray(object)
  ) {
    return {};
  }

  const result = {};

  for (const [key, value] of Object.entries(object)) {
    const normalizedKey =
      normalizeFieldName(key);

    if (!normalizedKey) {
      continue;
    }

    if (typeof value === "string") {
      result[normalizedKey] =
        cleanString(value);
    } else if (Array.isArray(value)) {
      result[normalizedKey] =
        normalizeArray(value);
    } else if (
      value &&
      typeof value === "object"
    ) {
      result[normalizedKey] =
        normalizeObject(value);
    } else {
      result[normalizedKey] = value;
    }
  }

  return result;
}


/**
 * Normalize an array.
 *
 * @param {Array} array
 * @returns {Array}
 */
function normalizeArray(array) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map((item) => {
    if (typeof item === "string") {
      return cleanString(item);
    }

    if (
      item &&
      typeof item === "object"
    ) {
      return normalizeObject(item);
    }

    return item;
  });
}


/**
 * Normalize a department record.
 *
 * @param {Object} department
 * @returns {Object}
 */
function normalizeDepartment(department) {
  const item =
    normalizeObject(department);

  return {
    id: cleanString(item.id),
    code: cleanString(item.code),
    name: cleanString(
      item.name ||
      item.department ||
      item.departmentName
    ),
    faculty: cleanString(
      item.faculty ||
      item.facultyName
    ),
    description: cleanString(
      item.description
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize a programme record.
 *
 * @param {Object} programme
 * @returns {Object}
 */
function normalizeProgramme(programme) {
  const item =
    normalizeObject(programme);

  return {
    id: cleanString(item.id),
    code: cleanString(item.code),
    name: cleanString(
      item.name ||
      item.programme ||
      item.program
    ),
    programme: cleanString(
      item.programme ||
      item.program ||
      item.name
    ),
    department: cleanString(
      item.department
    ),
    faculty: cleanString(
      item.faculty
    ),
    level: cleanString(
      item.level
    ),
    duration: cleanString(
      item.duration
    ),
    eligibility: cleanString(
      item.eligibility
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize a staff record.
 *
 * @param {Object} staff
 * @returns {Object}
 */
function normalizeStaff(staff) {
  const item =
    normalizeObject(staff);

  return {
    id: cleanString(item.id),
    name: cleanString(
      item.name
    ),
    designation: cleanString(
      item.designation
    ),
    department: cleanString(
      item.department
    ),
    faculty: cleanString(
      item.faculty
    ),
    profileUrl: cleanString(
      item.profileUrl
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize an examination record.
 *
 * @param {Object} examination
 * @returns {Object}
 */
function normalizeExamination(
  examination
) {
  const item =
    normalizeObject(examination);

  return {
    id: cleanString(item.id),
    title: cleanString(
      item.title ||
      item.name
    ),
    examination: cleanString(
      item.examination
    ),
    programme: cleanString(
      item.programme ||
      item.program
    ),
    semester: cleanString(
      item.semester
    ),
    academicYear: cleanString(
      item.academicYear
    ),
    examDate: cleanString(
      item.examDate
    ),
    timetableUrl: cleanString(
      item.timetableUrl
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize a notice record.
 *
 * @param {Object} notice
 * @returns {Object}
 */
function normalizeNotice(notice) {
  const item =
    normalizeObject(notice);

  return {
    id: cleanString(item.id),
    title: cleanString(
      item.title ||
      item.name
    ),
    category: cleanString(
      item.category
    ),
    date: cleanString(
      item.date
    ),
    content: cleanString(
      item.content
    ),
    noticeUrl: cleanString(
      item.noticeUrl ||
      item.url
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize a placement record.
 *
 * @param {Object} placement
 * @returns {Object}
 */
function normalizePlacement(
  placement
) {
  const item =
    normalizeObject(placement);

  return {
    id: cleanString(item.id),
    title: cleanString(
      item.title ||
      item.name
    ),
    academicYear: cleanString(
      item.academicYear
    ),
    department: cleanString(
      item.department
    ),
    company: cleanString(
      item.company
    ),
    description: cleanString(
      item.description
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize an admission record.
 *
 * @param {Object} admission
 * @returns {Object}
 */
function normalizeAdmission(
  admission
) {
  const item =
    normalizeObject(admission);

  return {
    id: cleanString(item.id),
    title: cleanString(
      item.title ||
      item.name
    ),
    programme: cleanString(
      item.programme ||
      item.program
    ),
    level: cleanString(
      item.level
    ),
    academicYear: cleanString(
      item.academicYear
    ),
    eligibility: cleanString(
      item.eligibility
    ),
    applicationStart: cleanString(
      item.applicationStart
    ),
    applicationEnd: cleanString(
      item.applicationEnd
    ),
    applicationUrl: cleanString(
      item.applicationUrl
    ),
    source: cleanString(
      item.source ||
      item.sourceUrl
    )
  };
}


/**
 * Normalize a complete public-data collection.
 *
 * @param {string} type
 * @param {Array} records
 * @returns {Array}
 */
function normalizeCollection(
  type,
  records
) {
  if (!Array.isArray(records)) {
    return [];
  }

  const normalizers = {
    departments: normalizeDepartment,
    programmes: normalizeProgramme,
    staff: normalizeStaff,
    examinations: normalizeExamination,
    notices: normalizeNotice,
    placements: normalizePlacement,
    admissions: normalizeAdmission
  };

  const normalizer =
    normalizers[type];

  if (!normalizer) {
    return normalizeArray(records);
  }

  return records.map(normalizer);
}


/**
 * Remove duplicate records.
 *
 * Records are compared using their ID where
 * available, otherwise their JSON representation.
 *
 * @param {Array} records
 * @returns {Array}
 */
function removeDuplicates(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  const seen = new Set();
  const result = [];

  for (const record of records) {
    let key;

    if (
      record &&
      typeof record === "object" &&
      record.id
    ) {
      key = `id:${String(record.id)
        .trim()
        .toLowerCase()}`;
    } else {
      key = `data:${JSON.stringify(record)}`;
    }

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(record);
  }

  return result;
}


/**
 * Normalize a search query.
 *
 * @param {string} query
 * @returns {string}
 */
function normalizeSearchQuery(query) {
  return cleanString(query)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s._/-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}


/**
 * Create a safe URL string.
 *
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  const value = cleanString(url);

  if (!value) {
    return "";
  }

  try {
    const parsed =
      new URL(value);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return "";
    }

    return parsed.toString();
  } catch {
    return "";
  }
}


/**
 * Normalize source information.
 *
 * @param {Object} record
 * @returns {Object}
 */
function normalizeSource(record) {
  const item =
    normalizeObject(record);

  const source =
    normalizeUrl(
      item.source ||
      item.sourceUrl
    );

  return {
    source,
    sourceUrl: source,
    lastUpdated: cleanString(
      item.lastUpdated
    )
  };
}


/**
 * Normalize an unknown public-data record.
 *
 * @param {Object} record
 * @returns {Object}
 */
function normalizePublicRecord(record) {
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    return {};
  }

  const normalized =
    normalizeObject(record);

  const source =
    normalizeSource(record);

  return {
    ...normalized,
    source:
      source.source ||
      cleanString(normalized.source),
    sourceUrl:
      source.sourceUrl ||
      cleanString(normalized.sourceUrl),
    lastUpdated:
      source.lastUpdated ||
      cleanString(normalized.lastUpdated)
  };
}


module.exports = {
  cleanString,
  normalizeFieldName,
  normalizeObject,
  normalizeArray,

  normalizeDepartment,
  normalizeProgramme,
  normalizeStaff,
  normalizeExamination,
  normalizeNotice,
  normalizePlacement,
  normalizeAdmission,

  normalizeCollection,
  removeDuplicates,

  normalizeSearchQuery,
  normalizeUrl,
  normalizeSource,
  normalizePublicRecord
};
