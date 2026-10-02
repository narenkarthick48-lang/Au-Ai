const express = require("express");

const router = express.Router();

/*
 * Public AU notices route.
 *
 * This route is intended only for notices and announcements
 * that are publicly available through Annamalai University
 * public sources.
 *
 * It must NOT:
 * - access restricted university systems
 * - bypass authentication or CAPTCHA
 * - expose private student information
 * - invent notice titles, dates, links, or announcements
 *
 * The actual public notice source can be connected through
 * the source/service layer later.
 */


// GET /api/notices
//
// Examples:
// /api/notices
// /api/notices?category=examination
// /api/notices?year=2026
// /api/notices?search=semester
//
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      year,
      department,
      limit
    } = req.query;

    let parsedLimit = null;

    if (limit !== undefined) {
      parsedLimit = Number(limit);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
      ) {
        return res.status(400).json({
          success: false,
          error: "Limit must be an integer between 1 and 100"
        });
      }
    }

    const filters = {
      search: search ? search.trim() : null,
      category: category ? category.trim() : null,
      year: year ? year.trim() : null,
      department: department ? department.trim() : null,
      limit: parsedLimit
    };

    /*
     * No fake notices are returned.
     *
     * The real notice data should come from the AU public
     * notice source through the source/service layer.
     */

    return res.status(200).json({
      success: true,
      available: false,
      filters,
      count: 0,
      data: [],
      message:
        "Public AU notices are not currently available from the connected public source."
    });
  } catch (error) {
    console.error("Notice route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve university notices"
    });
  }
});


// GET /api/notices/search
//
// Example:
// /api/notices/search?q=examination
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

    if (keyword.length < 2 || keyword.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Search query must contain between 2 and 100 characters"
      });
    }

    /*
     * Notice search will later use the AU public notice
     * source through the service/source layer.
     */

    return res.status(200).json({
      success: true,
      query: keyword,
      available: false,
      count: 0,
      data: [],
      message:
        "No publicly available AU notices were found from the connected public source."
    });
  } catch (error) {
    console.error("Notice search error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to search university notices"
   
