/**
 * AU Help AI
 * Ask Route
 *
 * Main conversational API endpoint.
 *
 * POST /api/ask
 *
 * Request:
 * {
 *   "message": "CSE department details"
 * }
 *
 * Optional:
 * {
 *   "message": "Check my result",
 *   "registerNumber": "123456789"
 * }
 */

const express = require("express");

const aiEngine = require("../ai/aiEngine");
const formatter = require("../ai/formatter");

const router = express.Router();

/**
 * Validate request body.
 */
function validateRequestBody(body) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      valid: false,
      error: "Request body must be an object"
    };
  }

  if (
    typeof body.message !== "string" ||
    body.message.trim() === ""
  ) {
    return {
      valid: false,
      error: "Message is required"
    };
  }

  if (body.message.length > 1000) {
    return {
      valid: false,
      error:
        "Message must not exceed 1000 characters"
    };
  }

  if (
    body.registerNumber !== undefined &&
    body.registerNumber !== null &&
    typeof body.registerNumber !== "string"
  ) {
    return {
      valid: false,
      error:
        "Register number must be a string"
    };
  }

  return {
    valid: true
  };
}

/**
 * POST /api/ask
 */
router.post("/", async (req, res) => {
  try {
    const validation =
      validateRequestBody(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const message =
      req.body.message.trim();

    const registerNumber =
      typeof req.body.registerNumber ===
      "string"
        ? req.body.registerNumber.trim()
        : undefined;

    const result =
      await aiEngine.processMessage({
        message,
        registerNumber
      });

    if (!result) {
      return res.status(500).json({
        success: false,
        error:
          "Unable to process the request"
      });
    }

    const response =
      formatter.toApiResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    console.error(
      "Ask route error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        "Something went wrong while processing your request"
    });
  }
});

/**
 * GET /api/ask/health
 *
 * Simple route-level health check.
 */
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "AU Help AI Ask API",
    status: "online"
  });
});

module.exports = router;
