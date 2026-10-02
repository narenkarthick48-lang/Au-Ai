const AU_BASE_URL = "https://annamalaiuniversity.ac.in";

/**
 * Fetch a publicly accessible Annamalai University page.
 *
 * This source layer must only access information that is
 * publicly available. It does not bypass authentication,
 * CAPTCHA, login pages, or restricted examination systems.
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
      `University examination source returned HTTP ${response.status}`
    );
  }

  return response.text();
}

/**
 * Get publicly available examination information.
 *
 * Only verified public examination information should be
 * returned from this function.
 */
async function getExaminations() {
  try {
    /*
     * The exact public examination page should be verified
     * before adding a parser.
     *
     * We intentionally do not create fake examination
     * dates, timetables, results, or hall-ticket information.
     */

    await fetchPublicPage("/");

    return [];
  } catch (error) {
    console.error(
      "Examination source error:",
      error.message
    );

    throw new Error(
      "Unable to access public examination information"
    );
  }
}

/**
 * Get the source URL used by this module.
 */
function getSourceUrl() {
  return AU_BASE_URL;
}

module.exports = {
  fetchPublicPage,
  getExaminations,
  getSourceUrl
};
