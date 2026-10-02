const AU_BASE_URL = "https://annamalaiuniversity.ac.in";

/**
 * Fetch a public page from Annamalai University.
 *
 * This helper is intentionally limited to publicly accessible
 * university pages. It does not bypass login, CAPTCHA,
 * authentication, or restricted student systems.
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
      `University source returned HTTP ${response.status}`
    );
  }

  return response.text();
}

/**
 * Get publicly available department information.
 *
 * At this stage the source layer does not invent department
 * records. It returns an empty list until the public AU
 * department page is parsed and verified.
 */
async function getDepartments() {
  try {
    // Public university homepage check.
    await fetchPublicPage("/");

    /*
     * TODO:
     * Parse the verified public AU department/faculty page here.
     *
     * Expected structure:
     *
     * [
     *   {
     *     id: "...",
     *     code: "...",
     *     name: "...",
     *     faculty: "...",
     *     source: "https://..."
     *   }
     * ]
     *
     * Do not add invented or sample department records.
     */
    return [];
  } catch (error) {
    console.error(
      "University department source error:",
      error.message
    );

    throw new Error(
      "Unable to access public university information"
    );
  }
}

/**
 * Get the university base URL.
 */
function getUniversityBaseUrl() {
  return AU_BASE_URL;
}

module.exports = {
  fetchPublicPage,
  getDepartments,
  getUniversityBaseUrl
};
