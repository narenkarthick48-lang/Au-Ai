const express = require("express");

const router = express.Router();

/*
 * Public programme information.
 *
 * Only programme information that is publicly available should
 * be returned by this API.
 *
 * Current project data includes publicly listed programmes such as:
 * - B.E. Computer Science and Engineering
 * - B.E. Artificial Intelligence and Machine Learning
 *
 * The route is kept separate from the service layer so that the
 * actual AU public source can be connected later through
 * programmeService.js.
 */

// GET /api/programmes
router.get("/", async (req, res) => {
  try {
    const { search, level, department } = req.query;

    /*
     * No invented programme records are returned here.
     * The connected public AU source/service will provide the
     * actual programme information.
     */

    const filters = {
      search: search ? search.trim() : null,
      level: level ? level.trim() : null,
      department: department ? department.trim() : null
    };

    return res.status(200).json({
      success: true,
      count: 0,
      filters,
      data: [],
      message:
        "Public programme information is not currently available from the connected AU public source."
    });
  } catch (error) {
    console.error("Programme route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve programme information"
    });
  }
});


// GET /api/programmes/search
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
     * Programme search will be connected to programmeService.js.
     * The service will use publicly available AU information.
     */

    return res.status(200).json({
      success: true,
      query: keyword,
      count: 0,
      data: [],
      message:
        "No publicly available programme information was found from the connected AU public source."
    });
  } catch (error) {
    console.error("Programme search error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to search programme information"
    });
  }
});


// GET /api/programmes/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: "Programme ID is required"
      });
    }

    /*
     * Individual programme lookup will be connected to the
     * public AU programme source through programmeService.js.
     */

    return res.status(404).json({
      success: false,
      error: "Programme information not publicly available"
    });
  } catch (error) {
    console.error("Programme lookup error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve programme information"
    });
  }
});


module.exports = router;
