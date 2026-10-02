const universitySource = require("../sources/university");

/*
 * Department service
 *
 * Responsibilities:
 * 1. Get public department information from the AU source layer.
 * 2. Normalize the returned structure.
 * 3. Provide search and filtering for the API routes.
 *
 * This service does not bypass authentication, CAPTCHA,
 * or restricted university systems.
 */


/**
 * Normalize a single department record.
 *
 * @param {Object} department
 * @returns {Object}
 */
function normalizeDepartment(department) {
  if (!department || typeof department !== "object") {
    return null;
  }

  return {
    id: department.id ?? null,
    name: department.name ?? null,
    faculty: department.faculty ?? null,
    code: department.code ?? null,
    description: department.description ?? null,
    source: department.source ?? null
  };
}


/**
 * Get all publicly available departments.
 *
 * @returns {Promise<Array>}
 */
async function getDepartments() {
  const departments = await universitySource.getDepartments();

  if (!Array.isArray(departments)) {
    return [];
  }

  return departments
    .map(normalizeDepartment)
    .filter(Boolean);
}


/**
 * Search departments by name, code, faculty, or description.
 *
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
async function searchDepartments(keyword) {
  const searchTerm = String(keyword || "")
    .trim()
    .toLowerCase();

  if (!searchTerm) {
    return getDepartments();
  }

  const departments = await getDepartments();

  return departments.filter((department) => {
    const searchableText = [
      department.name,
      department.code,
      department.faculty,
      department.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });
}


/**
 * Filter departments by faculty.
 *
 * @param {string} faculty
 * @returns {Promise<Array>}
 */
async function getDepartmentsByFaculty(faculty) {
  const facultyName = String(faculty || "")
    .trim()
    .toLowerCase();

  if (!facultyName) {
    return getDepartments();
  }

  const departments = await getDepartments();

  return departments.filter((department) => {
    return (
      String(department.faculty || "")
        .trim()
        .toLowerCase() === facultyName
    );
  });
}


/**
 * Find one department by ID.
 *
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
async function getDepartmentById(id) {
  const departmentId = String(id || "").trim();

  if (!departmentId) {
    return null;
  }

  const departments = await getDepartments();

  return (
    departments.find(
      (department) =>
        String(department.id || "").trim() === departmentId
    ) || null
  );
}


module.exports = {
  getDepartments,
  searchDepartments,
  getDepartmentsByFaculty,
  getDepartmentById,
  normalizeDepartment
};
