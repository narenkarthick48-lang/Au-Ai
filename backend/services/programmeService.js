/**
 * AU Help AI
 * Programme Service
 *
 * Handles programme-related business logic.
 * Data must come from a verified public AU source.
 */

const universitySource = require("../sources/university");

async function getProgrammes(options = {}) {
  try {
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

      if (keyword) {
        result = result.filter((programme) => {
          const name = String(
            programme.name || ""
          ).toLowerCase();

          const code = String(
            programme.code || ""
          ).toLowerCase();

          const department = String(
            programme.department || ""
          ).toLowerCase();

          const level = String(
            programme.level || ""
          ).toLowerCase();

          return (
            name.includes(keyword) ||
            code.includes(keyword) ||
            department.includes(keyword) ||
            level.includes(keyword)
          );
        });
      }
    }

    if (options.level) {
      const levelKeyword = String(
        options.level
      )
        .trim()
        .toLowerCase();

      if (levelKeyword) {
        result = result.filter((programme) => {
          return String(
            programme.level || ""
          )
            .toLowerCase()
            .includes(levelKeyword);
        });
      }
    }

    if (options.department) {
      const departmentKeyword = String(
        options.department
      )
        .trim()
        .toLowerCase();

      if (departmentKeyword) {
        result = result.filter((programme) => {
          return String(
            programme.department || ""
          )
            .toLowerCase()
            .includes(departmentKeyword);
        });
      }
    }

    return result;
  } catch (error) {
    console.error(
      "Programme service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve programme information"
    );
  }
}

async function searchProgrammes(keyword) {
  return getProgrammes({
    search: keyword
  });
}

async function getProgrammeById(id) {
  try {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      return null;
    }

    const programmes =
      await universitySource.getProgrammes();

    if (!Array.isArray(programmes)) {
      return null;
    }

    const requestedId =
      String(id).trim().toLowerCase();

    const programme = programmes.find(
      (item) => {
        const itemId = String(
          item.id || ""
        )
          .trim()
          .toLowerCase();

        const itemCode = String(
          item.code || ""
        )
          .trim()
          .toLowerCase();

        return (
          itemId === requestedId ||
          itemCode === requestedId
        );
      }
    );

    return programme || null;
  } catch (error) {
    console.error(
      "Programme lookup service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve programme"
    );
  }
}

async function getProgrammesByDepartment(
  department
) {
  return getProgrammes({
    department
  });
}

async function getProgrammesByLevel(level) {
  return getProgrammes({
    level
  });
}

module.exports = {
  getProgrammes,
  searchProgrammes,
  getProgrammeById,
  getProgrammesByDepartment,
  getProgrammesByLevel
};
