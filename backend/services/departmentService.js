const universitySource = require("../sources/university");

/**
 * Get all publicly available department information.
 *
 * This service does not contain private student information.
 * It only works with information made publicly available
 * by the university source layer.
 */
async function getDepartments(options = {}) {
  try {
    const departments = await universitySource.getDepartments();

    if (!Array.isArray(departments)) {
      return [];
    }

    let result = departments;

    // Optional search filter
    if (options.search) {
      const keyword = String(options.search)
        .trim()
        .toLowerCase();

      if (keyword) {
        result = result.filter((department) => {
          const name = String(department.name || "").toLowerCase();
          const code = String(department.code || "").toLowerCase();
          const faculty = String(
            department.faculty || ""
          ).toLowerCase();

          return (
            name.includes(keyword) ||
            code.includes(keyword) ||
            faculty.includes(keyword)
          );
        });
      }
    }

    // Optional faculty filter
    if (options.faculty) {
      const facultyKeyword = String(options.faculty)
        .trim()
        .toLowerCase();

      if (facultyKeyword) {
        result = result.filter((department) => {
          const faculty = String(
            department.faculty || ""
          ).toLowerCase();

          return faculty.includes(facultyKeyword);
        });
      }
    }

    return result;
  } catch (error) {
    console.error(
      "Department service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve department information"
    );
  }
}

/**
 * Get one department by its identifier.
 */
async function getDepartmentById(id) {
  try {
    const departments = await universitySource.getDepartments();

    if (!Array.isArray(departments)) {
      return null;
    }

    const department = departments.find(
      (item) =>
        String(item.id) === String(id) ||
        String(item.code || "").toLowerCase() ===
          String(id).toLowerCase()
    );

    return department || null;
  } catch (error) {
    console.error(
      "Department lookup service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve department"
    );
  }
}

module.exports = {
  getDepartments,
  getDepartmentById
};
