/**
 * AU Help AI
 * Validation Utilities
 *
 * Purpose:
 * - Validate incoming API data
 * - Validate public AU records
 * - Validate search/query parameters
 * - Prevent malformed data from entering services/database
 *
 * Note:
 * This file performs structural validation only.
 * It does NOT verify whether university information is factually correct.
 */

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isValidId(value) {
  if (!isNonEmptyString(String(value || ""))) {
    return false;
  }

  const id = String(value).trim();

  return /^[A-Za-z0-9_-]{1,100}$/.test(id);
}

function isValidRegisterNumber(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const registerNumber = value.trim();

  /*
   * Accept common university register-number formats
   * without assuming one specific AU format.
   */
  return /^[A-Za-z0-9/_-]{3,30}$/.test(
    registerNumber
  );
}

function isValidUrl(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch (error) {
    return false;
  }
}

function isValidDateString(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

function isValidArray(value) {
  return Array.isArray(value);
}

function hasRequiredFields(
  object,
  requiredFields = []
) {
  if (!isObject(object)) {
    return false;
  }

  if (!Array.isArray(requiredFields)) {
    return false;
  }

  return requiredFields.every((field) => {
    return isNonEmptyString(
      String(object[field] ?? "")
    );
  });
}

function validateRequiredFields(
  object,
  requiredFields = []
) {
  const errors = [];

  if (!isObject(object)) {
    return {
      valid: false,
      errors: ["Expected an object"]
    };
  }

  if (!Array.isArray(requiredFields)) {
    return {
      valid: false,
      errors: ["Required fields must be an array"]
    };
  }

  for (const field of requiredFields) {
    if (
      !isNonEmptyString(
        String(object[field] ?? "")
      )
    ) {
      errors.push(
        `${field} is required`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateStringLength(
  value,
  min = 0,
  max = Infinity
) {
  if (typeof value !== "string") {
    return false;
  }

  const length = value.trim().length;

  return (
    length >= min &&
    length <= max
  );
}

function validateSearchQuery(value) {
  if (value === undefined || value === null) {
    return {
      valid: true,
      value: ""
    };
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      value: "",
      error: "Search query must be a string"
    };
  }

  const search = value.trim();

  if (search.length > 100) {
    return {
      valid: false,
      value: search,
      error:
        "Search query must not exceed 100 characters"
    };
  }

  return {
    valid: true,
    value: search
  };
}

function validateRegisterNumber(value) {
  if (!isNonEmptyString(value)) {
    return {
      valid: false,
      error: "Register number is required"
    };
  }

  if (!isValidRegisterNumber(value)) {
    return {
      valid: false,
      error:
        "Invalid register number format"
    };
  }

  return {
    valid: true,
    value: value.trim()
  };
}

function validateDepartment(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: ["Department must be an object"]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Department id is required");
  }

  if (!isNonEmptyString(record.name)) {
    errors.push("Department name is required");
  }

  if (
    record.code !== undefined &&
    !isNonEmptyString(record.code)
  ) {
    errors.push("Department code must be a string");
  }

  if (
    record.faculty !== undefined &&
    !isNonEmptyString(record.faculty)
  ) {
    errors.push(
      "Department faculty must be a string"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Department source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateProgramme(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: ["Programme must be an object"]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Programme id is required");
  }

  if (!isNonEmptyString(record.name)) {
    errors.push("Programme name is required");
  }

  if (
    record.level !== undefined &&
    !isNonEmptyString(record.level)
  ) {
    errors.push(
      "Programme level must be a string"
    );
  }

  if (
    record.department !== undefined &&
    !isNonEmptyString(record.department)
  ) {
    errors.push(
      "Programme department must be a string"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Programme source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateStaff(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: ["Staff record must be an object"]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Staff id is required");
  }

  if (!isNonEmptyString(record.name)) {
    errors.push("Staff name is required");
  }

  if (
    record.designation !== undefined &&
    !isNonEmptyString(record.designation)
  ) {
    errors.push(
      "Staff designation must be a string"
    );
  }

  if (
    record.department !== undefined &&
    !isNonEmptyString(record.department)
  ) {
    errors.push(
      "Staff department must be a string"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Staff source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateExamination(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: [
        "Examination record must be an object"
      ]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Examination id is required");
  }

  if (!isNonEmptyString(record.title)) {
    errors.push(
      "Examination title is required"
    );
  }

  if (
    record.date !== undefined &&
    !isValidDateString(record.date)
  ) {
    errors.push(
      "Examination date must be valid"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Examination source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateNotice(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: ["Notice must be an object"]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Notice id is required");
  }

  if (!isNonEmptyString(record.title)) {
    errors.push("Notice title is required");
  }

  if (
    record.date !== undefined &&
    !isValidDateString(record.date)
  ) {
    errors.push(
      "Notice date must be valid"
    );
  }

  if (
    record.url !== undefined &&
    !isValidUrl(record.url)
  ) {
    errors.push(
      "Notice URL must be valid"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Notice source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validatePlacement(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: [
        "Placement record must be an object"
      ]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Placement id is required");
  }

  if (
    record.title !== undefined &&
    !isNonEmptyString(record.title)
  ) {
    errors.push(
      "Placement title must be a string"
    );
  }

  if (
    record.company !== undefined &&
    !isNonEmptyString(record.company)
  ) {
    errors.push(
      "Placement company must be a string"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Placement source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateAdmission(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      valid: false,
      errors: [
        "Admission record must be an object"
      ]
    };
  }

  if (!isNonEmptyString(record.id)) {
    errors.push("Admission id is required");
  }

  if (
    record.title !== undefined &&
    !isNonEmptyString(record.title)
  ) {
    errors.push(
      "Admission title must be a string"
    );
  }

  if (
    record.programme !== undefined &&
    !isNonEmptyString(record.programme)
  ) {
    errors.push(
      "Admission programme must be a string"
    );
  }

  if (
    record.source !== undefined &&
    !isValidUrl(record.source)
  ) {
    errors.push(
      "Admission source must be a valid URL"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validatePublicRecord(
  type,
  record
) {
  switch (String(type).toLowerCase()) {
    case "department":
    case "departments":
      return validateDepartment(record);

    case "programme":
    case "programmes":
      return validateProgramme(record);

    case "staff":
      return validateStaff(record);

    case "examination":
    case "examinations":
      return validateExamination(record);

    case "notice":
    case "notices":
      return validateNotice(record);

    case "placement":
    case "placements":
      return validatePlacement(record);

    case "admission":
    case "admissions":
      return validateAdmission(record);

    default:
      return {
        valid: false,
        errors: [
          `Unknown public record type: ${type}`
        ]
      };
  }
}

function validatePublicCollection(
  type,
  records
) {
  if (!Array.isArray(records)) {
    return {
      valid: false,
      errors: ["Records must be an array"]
    };
  }

  const errors = [];

  records.forEach((record, index) => {
    const result = validatePublicRecord(
      type,
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

module.exports = {
  isObject,
  isNonEmptyString,
  isValidId,
  isValidRegisterNumber,
  isValidUrl,
  isValidDateString,
  isValidArray,
  hasRequiredFields,
  validateRequiredFields,
  validateStringLength,
  validateSearchQuery,
  validateRegisterNumber,
  validateDepartment,
  validateProgramme,
  validateStaff,
  validateExamination,
  validateNotice,
  validatePlacement,
  validateAdmission,
  validatePublicRecord,
  validatePublicCollection
};
