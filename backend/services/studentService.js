/**
 * AU Help AI
 * Student Service
 *
 * Coordinates public student information lookup.
 *
 * This service does not bypass restricted university systems.
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

async function getStudent(
  registerNumber
) {
  if (!validateRegisterNumber(registerNumber)) {
    throw new Error(
      "Invalid register number format"
    );
  }

  return studentPortal.getPublicStudentInfo(
    registerNumber
  );
}

async function getStudentInfo(
  registerNumber
) {
  return getStudent(registerNumber);
}

async function lookupStudent(
  registerNumber
) {
  return getStudent(registerNumber);
}

function getStudentAvailability() {
  return {
    available: false,
    message:
      "Student information is not currently available from a verified public source."
  };
}

module.exports = {
  validateRegisterNumber,
  getStudent,
  getStudentInfo,
  lookupStudent,
  getStudentAvailability
};
