/**
 * AU Help AI - Response Formatter
 *
 * This module converts raw service / AI-engine responses
 * into a consistent format that the frontend can display.
 *
 * It does not create or invent university information.
 */


/**
 * Safely convert a value into text.
 *
 * @param {*} value
 * @returns {string}
 */
function safeText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}


/**
 * Format a single data item into readable text.
 *
 * @param {Object} item
 * @returns {string}
 */
function formatDataItem(item) {
  if (item === null || item === undefined) {
    return "";
  }

  if (typeof item === "string") {
    return item;
  }

  if (typeof item !== "object") {
    return String(item);
  }

  const parts = [];

  const preferredFields = [
    "name",
    "title",
    "code",
    "programme",
    "program",
    "department",
    "faculty",
    "designation",
    "level",
    "academicYear",
    "eligibility",
    "applicationStart",
    "applicationEnd",
    "source"
  ];

  for (const field of preferredFields) {
    if (
      Object.prototype.hasOwnProperty.call(item, field) &&
      item[field] !== null &&
      item[field] !== undefined &&
      String(item[field]).trim() !== ""
    ) {
      parts.push(
        `${formatFieldName(field)}: ${item[field]}`
      );
    }
  }

  /*
   * If none of the preferred fields were found,
   * safely format all available object fields.
   */
  if (parts.length === 0) {
    for (const [key, value] of Object.entries(item)) {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        parts.push(
          `${formatFieldName(key)}: ${value}`
        );
      }
    }
  }

  return parts.join(" · ");
}


/**
 * Convert camelCase / field names into readable labels.
 *
 * @param {string} fieldName
 * @returns {string}
 */
function formatFieldName(fieldName) {
  return String(fieldName || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (character) =>
      character.toUpperCase()
    );
}


/**
 * Format an array of data records.
 *
 * @param {Array} data
 * @returns {Array<string>}
 */
function formatDataList(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => formatDataItem(item))
    .filter((item) => item !== "");
}


/**
 * Create a user-friendly message when information
 * is unavailable.
 *
 * @param {string} intent
 * @returns {string}
 */
function unavailableMessage(intent) {
  const messages = {
    departments:
      "Department information is not currently available from a verified public AU source.",

    programmes:
      "Programme information is not currently available from a verified public AU source.",

    results:
      "Student result information is not currently available from a verified public source.",

    fees:
      "Fee information is not currently available from a verified public AU source.",

    staff:
      "Public staff information is not currently available from a verified AU source.",

    admissions:
      "Public admissions information is not currently available from a verified AU source.",

    exams:
      "Public examination information is not currently available from a verified AU source.",

    notices:
      "Public notice information is not currently available from a verified AU source.",

    placements:
      "Public placement information is not currently available from a verified AU source.",

    general:
      "I could not find verified public AU information for that question."
  };

  return (
    messages[intent] ||
    "The requested information is not currently available from a verified public source."
  );
}


/**
 * Get a suitable heading for an intent.
 *
 * @param {string} intent
 * @returns {string}
 */
function getIntentTitle(intent) {
  const titles = {
    departments: "AU Departments",
    programmes: "AU Programmes",
    results: "Student Results",
    fees: "AU Fees",
    staff: "AU Staff",
    admissions: "Admissions",
    exams: "Examinations",
    notices: "AU Notices",
    placements: "Placements",
    general: "AU Help AI",
    unknown: "AU Help AI"
  };

  return titles[intent] || "AU Help AI";
}


/**
 * Format the complete engine response.
 *
 * @param {Object} response
 * @returns {Object}
 */
function formatResponse(response = {}) {
  const success = response.success !== false;
  const intent = safeText(response.intent) || "general";
  const rawMessage = safeText(response.message);
  const source = response.source || null;

  let data = response.data;

  /*
   * Convert data into a frontend-friendly list.
   */
  let formattedData = [];

  if (Array.isArray(data)) {
    formattedData = formatDataList(data);
  } else if (
    data !== null &&
    data !== undefined
  ) {
    const formattedItem = formatDataItem(data);

    if (formattedItem) {
      formattedData = [formattedItem];
    }
  }


  /*
   * If the service returned no useful data,
   * preserve its message or generate a safe
   * unavailable message.
   */
  let message = rawMessage;

  if (!message) {
    if (formattedData.length > 0) {
      message = `Found ${formattedData.length} record(s).`;
    } else {
      message = unavailableMessage(intent);
    }
  }


  return {
    success,
    intent,
    title: getIntentTitle(intent),
    message,
    data: formattedData,
    count: formattedData.length,
    source
  };
}


/**
 * Format an error response.
 *
 * This prevents internal error details from being
 * exposed directly to the frontend.
 *
 * @param {string} intent
 * @returns {Object}
 */
function formatError(intent = "general") {
  return {
    success: false,
    intent,
    title: getIntentTitle(intent),
    message:
      "Sorry, I couldn't process your request right now.",
    data: [],
    count: 0,
    source: null
  };
}


/**
 * Format a simple text response.
 *
 * @param {string} message
 * @param {string} intent
 * @returns {Object}
 */
function formatTextResponse(
  message,
  intent = "general"
) {
  return {
    success: true,
    intent,
    title: getIntentTitle(intent),
    message:
      safeText(message) ||
      unavailableMessage(intent),
    data: [],
    count: 0,
    source: null
  };
}


/**
 * Format a source reference.
 *
 * @param {string} source
 * @returns {Object|null}
 */
function formatSource(source) {
  if (!source) {
    return null;
  }

  const url = safeText(source);

  if (!url) {
    return null;
  }

  return {
    url,
    label: "Official public source"
  };
}


/**
 * Check whether a response contains useful data.
 *
 * @param {Object} response
 * @returns {boolean}
 */
function hasData(response = {}) {
  if (!response.data) {
    return false;
  }

  if (Array.isArray(response.data)) {
    return response.data.length > 0;
  }

  return Object.keys(response.data).length > 0;
}


/**
 * Prepare a response specifically for the frontend API.
 *
 * @param {Object} response
 * @returns {Object}
 */
function toApiResponse(response = {}) {
  const formatted = formatResponse(response);

  return {
    success: formatted.success,
    intent: formatted.intent,
    title: formatted.title,
    message: formatted.message,
    data: formatted.data,
    count: formatted.count,
    source: formatSource(formatted.source)
  };
}


module.exports = {
  safeText,
  formatDataItem,
  formatDataList,
  formatFieldName,
  unavailableMessage,
  getIntentTitle,
  formatResponse,
  formatError,
  formatTextResponse,
  formatSource,
  hasData,
  toApiResponse
};
