const express = require("express");

const router = express.Router();

/*
 * Public staff information only.
 *
 * Do not add private information such as:
 * - personal phone numbers
 * - personal email addresses
 * - passwords
 * - login details
 * - private student/staff records
 *
 * Real staff information should later be loaded from the
 * AU public-data service/source layer.
 */

// GET /api/staff
router.get("/", async (req, res) => {
  try {
    const { search, department, designation } = req.query;

    /*
     * This route is intentionally prepared for the service layer.
     * We don't invent staff names or personal details here.
     *
     * Until the public AU staff source is connected, return an
     * explicit "not available" response instead of fake data.
     */

    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message:
        "Public staff information is not currently available from the connected AU public source."
    });
  } catch (error) {
    console.error("Staff route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve staff information"
    });
  }
});


// GET /api/staff/search
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
     * Search will be connected to the public AU staff source
     * through staffService.js.
     */

    return res.status(200).json({
      success: true,
      query: keyword,
      count: 0,
      data: [],
      message:
        "No publicly available staff information was found from the connected AU public source."
    });
  } catch (error) {
    console.error("Staff search error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to search staff information"
    });
  }
});


// GET /api/staff/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: "Staff ID is required"
      });
    }

    /*
     * Individual staff lookup will use the public AU source.
     * No private or restricted staff records are accessed.
     */

    return res.status(404).json({
      success: false,
      error: "Staff information not publicly available"
    });
  } catch (error) {
    console.error("Staff lookup error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve staff information"
    });
  }
});


module.exports = router;
