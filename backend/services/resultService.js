/**
 * AU Help AI
 * Result Service
 *
 * Handles student result lookup.
 *
 * Security:
 * - Does not bypass authentication.
 * - Does not bypass CAPTCHA.
 * - Does not access restricted student portals.
 * - Only uses a verified public result source.
 * - Does not fabricate marks or results.
 */

const studentPortal =
  require("../sources/studentPortal");

function validateRegisterNumber(
  registerNumber
) {
  return studentPortal.isValidRegisterNumber(
    registerNumber
  );
}

async function getStudentResult(
  registerNumber
) {
  if (!validateRegisterNumber(registerNumber)) {
    throw new Error(
      "Invalid register number format"
    );
  }

  const result =
    await studentPortal.getPublicStudentInfo(
      registerNumber
    );

  if (!result) {
    return {
      available: false,
      message:
        "Student result information is not currently available from a verified public source."
    };
  }

  return result;
}

async function getResult(registerNumber) {
  return getStudentResult(registerNumber);
}

async function searchResult(
  registerNumber
) {
  return getStudentResult(registerNumber);
}

function getResultAvailability() {
  return {
    available: false,
    message:
      "Student result lookup requires a verified public university source."
  };
}

module.exports = {
  validateRegisterNumber,
  getStudentResult,
  getResult,
  searchResult,
  getResultAvailability
};
