const AU_BASE_URL = "https://annamalaiuniversity.ac.in";

/**
 * Student portal source layer.
 *
 * This module is restricted to publicly accessible information.
 *
 * It does NOT:
 * - bypass login
 * - bypass CAPTCHA
 * - guess passwords
 * - access private student records
 * - access restricted examination systems
 */

/**
 * Fetch a publicly accessible page.
 */
async function fetchPublicPage(path = "/") {
  const url = new URL(path, AU_BASE_URL);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "AU-Help-AI-Student-Project/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Student portal source returned HTTP ${response.status}`
    );
  }

  return response.text();
}

/**
 * Check whether a value looks like a valid register/roll number.
 *
 * This only validates the format supplied by the user.
 * It does not use the number to access private systems.
 */
function isValidRegisterNumber(registerNumber) {
  if (
    typeof registerNumber !== "string" ||
    registerNumber.trim() === ""
  ) {
    return false;
  }

  const value = registerNumber.trim();

  // Allow common university register-number characters.
  return /^[A-Za-z0-9/_-]{3,30}$/.test(value);
}

/**
 * Public student lookup.
 *
 * No private student record is fabricated or returned here.
 * A real public source must be verified before implementing
 * an actual lookup.
 */
async function getPublicStudentInfo(registerNumber) {
  if (!isValidRegisterNumber(registerNumber)) {
    throw new Error("Invalid register number format");
  }

  /*
   * IMPORTANT:
   *
   * Do not send the register number to a private or
   * authentication-protected university system.
   *
   * Until a legitimate public source is verified,
   * return an unavailable status instead of inventing data.
   */

  return {
    available: false,
    message:
      "Student information is not currently available from a verified public source.",
    registerNumber: registerNumber.trim()
  };
}

/**
 * Return the public university source URL.
 */
function getSourceUrl() {
  return AU_BASE_URL;
}

module.exports = {
  fetchPublicPage,
  isValidRegisterNumber,
  getPublicStudentInfo,
  getSourceUrl
};
