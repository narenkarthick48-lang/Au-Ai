const express = require("express");

const router = express.Router();

/*
 * Public examination information route.
 *
 * This route is intended for information that is publicly
 * available from Annamalai University examination sources.
 *
 * It must NOT:
 * - bypass login systems
 * - bypass CAPTCHA
 * - access restricted examination portals
 * - expose private student records
 * - invent examination dates, results, or marks
 *
 * The actual AU public-source integration can be connected
 * through the examination service/source layer later.
 */


// GET /api/exams
//
// Examples:
// /api/exams
// /api/exams?semester=5
// /api/exams?programme=B.E.%20Computer%20Science
// /api/exams?type=timetable
//
router.get("/", async (req, res) => {
  try {
    const {
      semester,
      programme,
      department,
      type,
      year
    } = req.query;

    const filters = {
      semester: semester ? semester.trim() : null,
      programme: programme ? programme.trim() : null,
      department: department ? department.trim() : null,
      type: type ? type.trim() : null,
      year: year ? year.trim() : null
    };

    /*
     * Do not return invented examination information.
     *
     * Examination data should be supplied by a legitimate
     * AU public source through the source/service layer.
     */

    return res.status(200).json({
      success: true,
      available: false,
      filters,
      count: 0,
      data: [],
      message:
        "Public examination information is not currently available from the connected AU public source."
    });
  } catch (error) {
    console.error("Examination route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve examination information"
    });
  }
});


// GET /api/exams/search
//
// Example:
// /api/exams/search?q=semester%20exam
//
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const keyword = q.trim();

    /*
     * Search will later be connected to the AU examination
     * public source through the service/source layer.
     */

    return res.status(200).json({
      success: true,
      query: keyword,
      available: false,
      count: 0,
      data: [],
      message:
        "No publicly available examination information was found from the connected AU public source."
    });
  } catch (error) {
    console.error("Examination search error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to search examination information"
    });
  }
});


// GET /api/exams/:id
//
// Example:
// /api/exams/EXAM-001
//
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: "Examination ID is required"
      });
    }

    const examId = id.trim();

    /*
     * Individual examination lookup will be connected to the
     * legitimate AU public examination source.
     */

    return res.status(404).json({
      success: false,
      available: false,
      id: examId,
      error:
        "Examination information is not publicly available from the connected AU source"
    });
  } catch (error) {
    console.error("Individual examination lookup error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve examination information"
    });
  }
});


module.exports = router;
