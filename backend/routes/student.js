/**
 * AU Help AI
 * Student Route
 *
 * Public student information lookup.
 *
 * No authentication bypass.
 * No CAPTCHA bypass.
 * No restricted portal access.
 */

const express = require("express");

const studentService =
  require("../services/studentService");

const router = express.Router();

/**
 * GET /api/student
 *
 * Example:
 * /api/student?registerNumber=123456789
 */
router.get("/", async (req, res) => {
  try {
    const registerNumber =
      String(
        req.query.registerNumber || ""
      ).trim();

    if (!registerNumber) {
      return res.status(400).json({
        success: false,
        error:
          "Register number is required"
      });
    }

    const result =
      await studentService.getStudentInfo(
        registerNumber
      );

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(
      "Student route error:",
      error.message
    );

    if (
      error.message.includes(
        "Invalid register number"
      )
    ) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error:
        "Unable to retrieve student information"
    });
  }
});

/**
 * GET /api/student/availability
 */
router.get(
  "/availability",
  (req, res) => {
    return res.status(200).json({
      success: true,
      data:
        studentService.getStudentAvailability()
    });
  }
);

module.exports = router;
