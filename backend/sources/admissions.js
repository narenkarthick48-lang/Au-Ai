const AU_BASE_URL = "https://annamalaiuniversity.ac.in";

/*
 * Annamalai University public admissions source.
 *
 * This module handles only information that is publicly
 * available through AU admission pages.
 *
 * It does NOT:
 * - bypass authentication
 * - bypass CAPTCHA
 * - access private applicant records
 * - access application dashboards
 * - expose passwords or application credentials
 * - invent admission dates, fees, ranks, or eligibility
 */


/**
 * Fetch a publicly accessible AU page.
 *
 * @param {string} path
 * @returns {Promise<string>}
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
      `Admissions source returned HTTP ${response.status}`
    );
  }

  return response.text();
}


/**
 * Get publicly available admission information.
 *
 * No fake admission information is returned.
 *
 * A verified AU admission page should be connected here
 * before extracting actual dates, eligibility, fees, etc.
 *
 * @returns {Promise<Array>}
 */
async function getAdmissionInformation() {
  try {
    /*
     * Verify that the university public website is reachable.
     *
     * We intentionally do not assume that the homepage
     * contains admission information.
     */
    await fetchPublicPage("/");

    /*
     * TODO:
     *
     * Connect this function to the verified public AU
     * admissions page.
     *
     * Expected structure:
     *
     * [
     *   {
     *     title: "...",
     *     programme: "...",
     *     level: "UG",
     *     academicYear: "...",
     *     eligibility: "...",
     *     applicationStart: "...",
     *     applicationEnd: "...",
     *     source: "https://..."
     *   }
     * ]
     *
     * Do not add sample or invented admission information.
     */

    return [];
  } catch (error) {
    console.error(
      "Admissions source error:",
      error.message
    );

    throw new Error(
      "Unable to access public admissions information"
    );
  }
}


/**
 * Search publicly available admission information.
 *
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
async function searchAdmissions(keyword) {
  const searchTerm = String(keyword || "")
    .trim()
    .toLowerCase();

  if (!searchTerm) {
    return getAdmissionInformation();
  }

  const admissions = await getAdmissionInformation();

  return admissions.filter((item) => {
    const searchableText = [
      item.title,
      item.programme,
      item.level,
      item.academicYear,
      item.eligibility
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });
}


/**
 * Get the public AU admissions source URL.
 *
 * @returns {string}
 */
function getSourceUrl() {
  return AU_BASE_URL;
}


module.exports = {
  fetchPublicPage,
  getAdmissionInformation,
  searchAdmissions,
  getSourceUrl
};
