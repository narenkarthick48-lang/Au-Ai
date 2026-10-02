/**
 * AU Help AI
 * Staff Service
 *
 * Handles public staff/faculty information.
 *
 * Important:
 * - Uses only verified public university data.
 * - Does not expose private staff information.
 * - Does not invent staff names, designations, or contact details.
 */

const universitySource = require("../sources/university");

async function getStaff(options = {}) {
  try {
    const staff = await universitySource.getStaff();

    if (!Array.isArray(staff)) {
      return [];
    }

    let result = staff;

    if (options.search) {
      const keyword = String(options.search)
        .trim()
        .toLowerCase();

      if (keyword) {
        result = result.filter((member) => {
          const name = String(
            member.name || ""
          ).toLowerCase();

          const designation = String(
            member.designation || ""
          ).toLowerCase();

          const department = String(
            member.department || ""
          ).toLowerCase();

          const faculty = String(
            member.faculty || ""
          ).toLowerCase();

          return (
            name.includes(keyword) ||
            designation.includes(keyword) ||
            department.includes(keyword) ||
            faculty.includes(keyword)
          );
        });
      }
    }

    if (options.department) {
      const department = String(
        options.department
      )
        .trim()
        .toLowerCase();

      if (department) {
        result = result.filter((member) => {
          return String(
            member.department || ""
          )
            .toLowerCase()
            .includes(department);
        });
      }
    }

    if (options.designation) {
      const designation = String(
        options.designation
      )
        .trim()
        .toLowerCase();

      if (designation) {
        result = result.filter((member) => {
          return String(
            member.designation || ""
          )
            .toLowerCase()
            .includes(designation);
        });
      }
    }

    return result;
  } catch (error) {
    console.error(
      "Staff service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve staff information"
    );
  }
}

async function searchStaff(keyword) {
  return getStaff({
    search: keyword
  });
}

async function getStaffById(id) {
  try {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      return null;
    }

    const staff = await universitySource.getStaff();

    if (!Array.isArray(staff)) {
      return null;
    }

    const requestedId = String(id)
      .trim()
      .toLowerCase();

    const member = staff.find((item) => {
      const itemId = String(
        item.id || ""
      )
        .trim()
        .toLowerCase();

      return itemId === requestedId;
    });

    return member || null;
  } catch (error) {
    console.error(
      "Staff lookup service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve staff information"
    );
  }
}

async function getStaffByDepartment(
  department
) {
  return getStaff({
    department
  });
}

async function getStaffByDesignation(
  designation
) {
  return getStaff({
    designation
  });
}

module.exports = {
  getStaff,
  searchStaff,
  getStaffById,
  getStaffByDepartment,
  getStaffByDesignation
};
