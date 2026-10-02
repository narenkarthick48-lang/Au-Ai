/**
 * AU Help AI - AI Engine
 *
 * This module is responsible for:
 * - Understanding the user's question
 * - Detecting the user's intent
 * - Routing the question to the correct service
 * - Returning a structured answer
 *
 * IMPORTANT:
 * This engine does not invent university information.
 * If verified public information is unavailable,
 * it clearly tells the user that the information
 * is currently unavailable.
 */

const departmentService = require("../services/departmentService");
const resultService = require("../services/resultService");
const feeService = require("../services/feeService");
const staffService = require("../services/staffService");
const programmeService = require("../services/programmeService");


/**
 * Normalize user input.
 *
 * @param {string} message
 * @returns {string}
 */
function normalizeMessage(message) {
  return String(message || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/**
 * Detect the user's intent from the question.
 *
 * @param {string} message
 * @returns {string}
 */
function detectIntent(message) {
  const text = normalizeMessage(message);

  if (!text) {
    return "unknown";
  }

  /*
   * Result / mark related questions
   */
  if (
    text.includes("result") ||
    text.includes("results") ||
    text.includes("mark") ||
    text.includes("marks") ||
    text.includes("grade") ||
    text.includes("grades") ||
    text.includes("semester result") ||
    text.includes("exam result")
  ) {
    return "results";
  }


  /*
   * Fee related questions
   */
  if (
    text.includes("fee") ||
    text.includes("fees") ||
    text.includes("tuition") ||
    text.includes("payment") ||
    text.includes("college fee") ||
    text.includes("course fee")
  ) {
    return "fees";
  }


  /*
   * Department related questions
   */
  if (
    text.includes("department") ||
    text.includes("departments") ||
    text.includes("faculty") ||
    text.includes("faculties") ||
    text.includes("hod") ||
    text.includes("head of department")
  ) {
    return "departments";
  }


  /*
   * Staff / teacher related questions
   */
  if (
    text.includes("staff") ||
    text.includes("teacher") ||
    text.includes("teachers") ||
    text.includes("professor") ||
    text.includes("professors") ||
    text.includes("faculty member")
  ) {
    return "staff";
  }


  /*
   * Programme / course related questions
   */
  if (
    text.includes("programme") ||
    text.includes("program") ||
    text.includes("course") ||
    text.includes("courses") ||
    text.includes("degree") ||
    text.includes("degrees") ||
    text.includes("b.e") ||
    text.includes("btech") ||
    text.includes("b.tech") ||
    text.includes("m.e") ||
    text.includes("m.tech")
  ) {
    return "programmes";
  }


  /*
   * Admission related questions
   */
  if (
    text.includes("admission") ||
    text.includes("admissions") ||
    text.includes("apply") ||
    text.includes("application") ||
    text.includes("eligibility") ||
    text.includes("admission date")
  ) {
    return "admissions";
  }


  /*
   * Examination related questions
   */
  if (
    text.includes("exam") ||
    text.includes("examination") ||
    text.includes("timetable") ||
    text.includes("time table") ||
    text.includes("hall ticket")
  ) {
    return "exams";
  }


  /*
   * Notice related questions
   */
  if (
    text.includes("notice") ||
    text.includes("notices") ||
    text.includes("notification") ||
    text.includes("announcement") ||
    text.includes("circular")
  ) {
    return "notices";
  }


  /*
   * Placement related questions
   */
  if (
    text.includes("placement") ||
    text.includes("placements") ||
    text.includes("company") ||
    text.includes("companies") ||
    text.includes("recruitment")
  ) {
    return "placements";
  }


  return "general";
}


/**
 * Extract a possible register number from the user's message.
 *
 * This only extracts a value from the message.
 * It does not access private university systems.
 *
 * @param {string} message
 * @returns {string|null}
 */
function extractRegisterNumber(message) {
  const text = String(message || "");

  const patterns = [
    /register\s*(?:number|no|num|id)?\s*[:#-]?\s*([A-Za-z0-9/_-]{3,30})/i,
    /reg\s*(?:number|no|num|id)?\s*[:#-]?\s*([A-Za-z0-9/_-]{3,30})/i,
    /roll\s*(?:number|no|num|id)?\s*[:#-]?\s*([A-Za-z0-9/_-]{3,30})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}


/**
 * Extract a search keyword from the user's message.
 *
 * @param {string} message
 * @returns {string}
 */
function extractSearchKeyword(message) {
  const text = String(message || "").trim();

  if (!text) {
    return "";
  }

  return text
    .replace(
      /^(tell me about|show me|give me|find|search|list|what is|what are|where is|where are)\s+/i,
      ""
    )
    .trim();
}


/**
 * Create a standard response object.
 *
 * @param {Object} data
 * @returns {Object}
 */
function createResponse(data = {}) {
  return {
    success: data.success !== false,
    intent: data.intent || "general",
    message: data.message || "",
    data: data.data || null,
    source: data.source || null
  };
}


/**
 * Handle department questions.
 *
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function handleDepartments(message) {
  const keyword = extractSearchKeyword(message);

  let departments;

  if (keyword) {
    departments = await departmentService.getDepartments({
      search: keyword
    });
  } else {
    departments = await departmentService.getDepartments();
  }

  if (!Array.isArray(departments) || departments.length === 0) {
    return createResponse({
      intent: "departments",
      message:
        "Department information is not currently available from a verified public AU source.",
      data: []
    });
  }

  return createResponse({
    intent: "departments",
    message: `Found ${departments.length} department record(s).`,
    data: departments
  });
}


/**
 * Handle programme questions.
 *
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function handleProgrammes(message) {
  const keyword = extractSearchKeyword(message);

  try {
    let programmes;

    if (typeof programmeService.searchProgrammes === "function" && keyword) {
      programmes = await programmeService.searchProgrammes(keyword);
    } else if (
      typeof programmeService.getProgrammes === "function"
    ) {
      programmes = await programmeService.getProgrammes();
    } else {
      programmes = [];
    }

    if (!Array.isArray(programmes) || programmes.length === 0) {
      return createResponse({
        intent: "programmes",
        message:
          "Programme information is not currently available from a verified public AU source.",
        data: []
      });
    }

    return createResponse({
      intent: "programmes",
      message: `Found ${programmes.length} programme record(s).`,
      data: programmes
    });
  } catch (error) {
    console.error(
      "Programme AI handler error:",
      error.message
    );

    return createResponse({
      success: false,
      intent: "programmes",
      message:
        "Unable to retrieve programme information right now."
    });
  }
}


/**
 * Handle result questions.
 *
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function handleResults(message) {
  const registerNumber = extractRegisterNumber(message);

  if (!registerNumber) {
    return createResponse({
      intent: "results",
      message:
        "Please provide your register number if you are asking about result information."
    });
  }

  try {
    let result;

    if (
      typeof resultService.getStudentResult === "function"
    ) {
      result = await resultService.getStudentResult(
        registerNumber
      );
    } else if (
      typeof resultService.getResult === "function"
    ) {
      result = await resultService.getResult(
        registerNumber
      );
    } else {
      result = null;
    }

    if (!result) {
      return createResponse({
        intent: "results",
        message:
          "Student result information is not currently available from a verified public source.",
        data: null
      });
    }

    return createResponse({
      intent: "results",
      message: "Result information retrieved.",
      data: result
    });
  } catch (error) {
    console.error(
      "Result AI handler error:",
      error.message
    );

    return createResponse({
      success: false,
      intent: "results",
      message:
        "Unable to retrieve result information right now."
    });
  }
}


/**
 * Handle fee questions.
 *
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function handleFees(message) {
  try {
    let fees;

    if (typeof feeService.getFees === "function") {
      fees = await feeService.getFees();
    } else if (
      typeof feeService.getFeeInformation === "function"
    ) {
      fees = await feeService.getFeeInformation();
    } else {
      fees = null;
    }

    if (!fees || (Array.isArray(fees) && fees.length === 0)) {
      return createResponse({
        intent: "fees",
        message:
          "General fee information is not currently available from a verified public AU source.",
        data: []
      });
    }

    return createResponse({
      intent: "fees",
      message: "Public fee information retrieved.",
      data: fees
    });
  } catch (error) {
    console.error(
      "Fee AI handler error:",
      error.message
    );

    return createResponse({
      success: false,
      intent: "fees",
      message:
        "Unable to retrieve fee information right now."
    });
  }
}


/**
 * Handle staff questions.
 *
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function handleStaff(message) {
  const keyword = extractSearchKeyword(message);

  try {
    let staff;

    if (
      typeof staffService.searchStaff === "function" &&
      keyword
    ) {
      staff = await staffService.searchStaff(keyword);
    } else if (
      typeof staffService.getStaff === "function"
    ) {
      staff = await staffService.getStaff();
    } else {
      staff = [];
    }

    if (!Array.isArray(staff) || staff.length === 0) {
      return createResponse({
        intent: "staff",
        message:
          "Public staff information is not currently available from a verified AU source.",
        data: []
      });
    }

    return createResponse({
      intent: "staff",
      message: `Found ${staff.length} staff record(s).`,
      data: staff
    });
  } catch (error) {
    console.error(
      "Staff AI handler error:",
      error.message
    );

    return createResponse({
      success: false,
      intent: "staff",
      message:
        "Unable to retrieve staff information right now."
    });
  }
}


/**
 * Handle general questions.
 *
 * @param {string} message
 * @returns {Object}
 */
function handleGeneral(message) {
  const text = normalizeMessage(message);

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("hello au") ||
    text.includes("hi au")
  ) {
    return createResponse({
      intent: "general",
      message:
        "Hello! I'm AU Help AI. Ask me about Annamalai University departments, programmes, exams, notices, placements, admissions, fees, staff, or public student information."
    });
  }

  if (
    text.includes("who are you") ||
    text.includes("what are you") ||
    text.includes("about you")
  ) {
    return createResponse({
      intent: "general",
      message:
        "I'm AU Help AI, a student-built assistant designed to help find publicly available Annamalai University information."
    });
  }

  if (
    text.includes("what can you do") ||
    text.includes("help me")
  ) {
    return createResponse({
      intent: "general",
      message:
        "I can help you find publicly available information about AU departments, programmes, examinations, notices, placements, admissions, fees and staff."
    });
  }

  return createResponse({
    intent: "general",
    message:
      "I can help with publicly available Annamalai University information. Try asking about departments, programmes, admissions, exams, fees, notices, placements, staff, or results."
  });
}


/**
 * Main AI engine.
 *
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function processMessage(message) {
  const normalized = normalizeMessage(message);

  if (!normalized) {
    return createResponse({
      success: false,
      intent: "unknown",
      message: "Please enter a question."
    });
  }

  const intent = detectIntent(normalized);

  try {
    switch (intent) {
      case "departments":
        return await handleDepartments(message);

      case "programmes":
        return await handleProgrammes(message);

      case "results":
        return await handleResults(message);

      case "fees":
        return await handleFees(message);

      case "staff":
        return await handleStaff(message);

      case "admissions":
        return createResponse({
          intent: "admissions",
          message:
            "Public admissions information is not currently available from a verified AU source."
        });

      case "exams":
        return createResponse({
          intent: "exams",
          message:
            "Public examination information is not currently available from a verified AU source."
        });

      case "notices":
        return createResponse({
          intent: "notices",
          message:
            "Public notice information is not currently available from a verified AU source."
        });

      case "placements":
        return createResponse({
          intent: "placements",
          message:
            "Public placement information is not currently available from a verified AU source."
        });

      case "general":
        return handleGeneral(message);

      default:
        return handleGeneral(message);
    }
  } catch (error) {
    console.error(
      "AI engine error:",
      error.message
    );

    return createResponse({
      success: false,
      intent,
      message:
        "Sorry, I couldn't process that request right now."
    });
  }
}


module.exports = {
  processMessage,
  detectIntent,
  extractRegisterNumber,
  extractSearchKeyword
};
