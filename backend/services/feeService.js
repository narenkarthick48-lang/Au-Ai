/**
 * AU Help AI
 * Fee Service
 *
 * Handles publicly available fee information.
 *
 * Important:
 * Individual student payment balances, transaction records,
 * payment credentials, and private financial information
 * are not exposed by this service.
 */

const admissionsSource =
  require("../sources/admissions");

async function getFees(options = {}) {
  try {
    const admissions =
      await admissionsSource.getAdmissionInformation();

    if (!Array.isArray(admissions)) {
      return [];
    }

    let result = admissions;

    if (options.search) {
      const keyword = String(options.search)
        .trim()
        .toLowerCase();

      if (keyword) {
        result = result.filter((item) => {
          const title = String(
            item.title || ""
          ).toLowerCase();

          const programme = String(
            item.programme || ""
          ).toLowerCase();

          const category = String(
            item.category || ""
          ).toLowerCase();

          return (
            title.includes(keyword) ||
            programme.includes(keyword) ||
            category.includes(keyword)
          );
        });
      }
    }

    return result;
  } catch (error) {
    console.error(
      "Fee service error:",
      error.message
    );

    throw new Error(
      "Unable to retrieve public fee information"
    );
  }
}

async function getFeeInformation(
  options = {}
) {
  return getFees(options);
}

async function searchFees(keyword) {
  return getFees({
    search: keyword
  });
}

async function getStudentFeeStatus(
  registerNumber
) {
  /*
   * Individual fee/payment status is not obtained
   * unless a verified public source explicitly provides it.
   */
  return {
    available: false,
    registerNumber:
      String(registerNumber || "").trim(),
    message:
      "Individual student fee information is not currently available from a verified public source."
  };
}

module.exports = {
  getFees,
  getFeeInformation,
  searchFees,
  getStudentFeeStatus
};
