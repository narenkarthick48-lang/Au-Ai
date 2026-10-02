/**
 * AU Help AI
 * AU Public Data Service
 *
 * Central service for public university information.
 *
 * This layer keeps source access separate from API routes.
 * It must never invent university information.
 */

const universitySource =
  require("../sources/university");

const examinationSource =
  require("../sources/examinations");

const admissionsSource =
  require("../sources/admissions");

async function getDepartments(options = {}) {
  const departments =
    await universitySource.getDepartments();

  if (!Array.isArray(departments)) {
    return [];
  }

  let result = departments;

  if (options.search) {
    const keyword = String(options.search)
      .trim()
      .toLowerCase();

    result = result.filter((item) => {
      return (
        String(item.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.code || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.faculty || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }

  return result;
}

async function getProgrammes(options = {}) {
  if (
    typeof universitySource.getProgrammes !==
    "function"
  ) {
    return [];
  }

  const programmes =
    await universitySource.getProgrammes();

  if (!Array.isArray(programmes)) {
    return [];
  }

  let result = programmes;

  if (options.search) {
    const keyword = String(options.search)
      .trim()
      .toLowerCase();

    result = result.filter((item) => {
      return (
        String(item.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.code || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.department || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }

  return result;
}

async function getStaff(options = {}) {
  if (
    typeof universitySource.getStaff !==
    "function"
  ) {
    return [];
  }

  const staff =
    await universitySource.getStaff();

  if (!Array.isArray(staff)) {
    return [];
  }

  let result = staff;

  if (options.search) {
    const keyword = String(options.search)
      .trim()
      .toLowerCase();

    result = result.filter((item) => {
      return (
        String(item.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.designation || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.department || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }

  return result;
}

async function getExaminations() {
  return examinationSource.getExaminations();
}

async function getAdmissions(options = {}) {
  if (options.search) {
    return admissionsSource.searchAdmissions(
      options.search
    );
  }

  return admissionsSource.getAdmissionInformation();
}

function getSourceUrls() {
  return {
    university:
      universitySource.getUniversityBaseUrl(),
    examinations:
      examinationSource.getSourceUrl(),
    admissions:
      admissionsSource.getSourceUrl()
  };
}

module.exports = {
  getDepartments,
  getProgrammes,
  getStaff,
  getExaminations,
  getAdmissions,
  getSourceUrls
};
