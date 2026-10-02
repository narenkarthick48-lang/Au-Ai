const express = require("express");

const router = express.Router();

/*
 * Public fee-information route.
 *
 * This route is only for general fee information that is
 * legitimately available through AU public sources.
 *
 * It must NOT expose:
 * - individual student's fee balance
 * - payment history
 * - transaction details
 * - bank/card information
 * - login credentials
 * - private financial records
 *
 * The actual public-source integration will be handled through
 * feeService.js.
 */


// GET /api/fees
//
// Examples:
// /api/fees
// /api/fees?programme=B.E.%20Computer%20Science
// /api/fees?level=UG
//
router.get("/", async (req, res) => {
  try {
    const {
      programme,
      department,
      level,
      category
    } = req.query;

    const filters = {
      programme: programme ? programme.trim() : null,
      department: department ? department.trim() : null,
      level: level ? level.trim() : null,
      category: category ? category.trim() : null
    };

    /*
     * Do not invent fee amounts.
     *
     * feeService.js will later retrieve fee information from
     * an authorized/public AU source.
     */

    return res.status(200).json({
      success: true,
      available: false,
      filters,
      count: 0,
      data: [],
      message:
        "Public fee information is not currently available from the connected AU public source."
    });
  } catch (error) {
    console.error("Fee route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve fee information"
    });
  }
});


// GET /api/fees/search
//
// Example:
// /api/fees/search?q=computer%20science
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
     * Search will be connected to feeService.js.
     */

    return res.status(200).json({
      success: true,
      query: keyword,
      available: false,
      count: 0,
      data: [],
      message:
        "No publicly available fee information was found from the connected AU public source."
    });
  } catch (error) {
    console.error("Fee search error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to search fee information"
    });
  }
});


// GET /api/fees/:programme
//
// Example:
// /api/fees/computer-science
//
router.get("/:programme", async (req, res) => {
  try {
    const { programme } = req.params;

    if (!programme || !programme.trim()) {
      return res.status(400).json({
        success: false,
        error: "Programme is required"
      });
    }

    const programmeName = programme.trim();

    /*
     * Individual programme fee lookup will use feeService.js.
     *
     * No fee amount is fabricated if the public AU source
     * does not provide one.
     */

    return res.status(404).json({
      success: false,
      available: false,
      programme: programmeName,
      error:
        "Fee information for this programme is not publicly available from the connected AU source"
    });
  } catch (error) {
    console.error("Programme fee lookup error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve programme fee information"
    });
  }
});


module.exports = router;
