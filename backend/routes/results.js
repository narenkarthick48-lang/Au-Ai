const express = require("express");

const router = express.Router();

/*
 * Public examination-result route.
 *
 * IMPORTANT:
 * This route must only work with result information that is
 * legitimately available through an AU public source.
 *
 * It must NOT:
 * - bypass authentication
 * - bypass CAPTCHA
 * - guess student credentials
 * - access restricted university systems
 * - expose private student information
 *
 * The actual public-source integration will be handled through
 * resultService.js.
 */


// GET /api/results
//
// Example:
// /api/results?registerNumber=123456
//
router.get("/", async (req, res) => {
  try {
    const { registerNumber, rollNumber, semester, exam } = req.query;

    /*
     * Accept either registerNumber or rollNumber because different
     * AU examination systems may use different terminology.
     */

    const studentNumber = registerNumber || rollNumber;

    if (!studentNumber || !studentNumber.trim()) {
      return res.status(400).json({
        success: false,
        error: "Register number or roll number is required"
      });
    }

    const normalizedNumber = studentNumber.trim();

    /*
     * Basic validation.
     *
     * This only validates the format supplied to our API.
     * It does NOT attempt to determine whether the number belongs
     * to a real student.
     */

    if (normalizedNumber.length < 3 || normalizedNumber.length > 30) {
      return res.status(400).json({
        success: false,
        error: "Invalid register number or roll number"
      });
    }

    /*
     * Do not return invented marks or result information.
     *
     * resultService.js will later connect this route to a legitimate
     * publicly accessible AU result source, if such a source exists.
     */

    return res.status(200).json({
      success: true,
      available: false,
      registerNumber: normalizedNumber,
      semester: semester ? semester.trim() : null,
      exam: exam ? exam.trim() : null,
      data: null,
      message:
        "Result information is not currently available from the connected public AU source."
    });
  } catch (error) {
    console.error("Result route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve result information"
    });
  }
});


// GET /api/results/search
//
// Example:
// /api/results/search?q=123456
//
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        error: "Register number or search query is required"
      });
    }

    const keyword = q.trim();

    if (keyword.length < 3 || keyword.length > 30) {
      return res.status(400).json({
        success: false,
        error: "Invalid search query"
      });
    }

    /*
     * Search functionality will use resultService.js.
     *
     * No result data is fabricated when the public source does
     * not provide it.
     */

    return res.status(200).json({
      success: true,
      query: keyword,
      available: false,
      count: 0,
      data: [],
      message:
        "No publicly available result information was found from the connected AU public source."
    });
  } catch (error) {
    console.error("Result search error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to search result information"
    });
  }
});


// GET /api/results/:registerNumber
//
// Example:
// /api/results/123456
//
router.get("/:registerNumber", async (req, res) => {
  try {
    const { registerNumber } = req.params;

    if (!registerNumber || !registerNumber.trim()) {
      return res.status(400).json({
        success: false,
        error: "Register number is required"
      });
    }

    const normalizedNumber = registerNumber.trim();

    if (normalizedNumber.length < 3 || normalizedNumber.length > 30) {
      return res.status(400).json({
        success: false,
        error: "Invalid register number"
      });
    }

    /*
     * Individual result lookup will be implemented through
     * resultService.js using only an authorized public source.
     */

    return res.status(404).json({
      success: false,
      available: false,
      error:
        "Result information is not publicly available from the connected AU source"
    });
  } catch (error) {
    console.error("Individual result lookup error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve result information"
    });
  }
});


module.exports = router;
