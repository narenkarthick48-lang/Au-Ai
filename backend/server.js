const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const APP_NAME = "AU Help AI";
const APP_VERSION = "1.0.0";

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Request Logger
// --------------------------------------------------

app.use((req, res, next) => {
  const time = new Date().toISOString();

  console.log(
    `[${time}] ${req.method} ${req.originalUrl}`
  );

  next();
});

// --------------------------------------------------
// Root Route
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: APP_NAME,
    version: APP_VERSION,
    message: "AU Help AI backend is running",
    status: "online"
  });
});

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: APP_NAME,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------
// API Information
// --------------------------------------------------

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: APP_NAME,
    version: APP_VERSION,
    description:
      "Independent student project for answering questions using public Annamalai University information.",
    endpoints: {
      health: "GET /api/health",
      departments: "GET /api/departments",
      programmes: "GET /api/programmes",
      staff: "GET /api/staff",
      examinations: "GET /api/examinations",
      notices: "GET /api/notices",
      placements: "GET /api/placements"
    }
  });
});

// --------------------------------------------------
// Temporary Public Data
// --------------------------------------------------
// Later these will be connected to the files inside
// backend/sources/ and proper service modules.
// --------------------------------------------------

const departments = [
  {
    id: 1,
    name: "Computer Science and Engineering",
    faculty: "Faculty of Engineering and Technology"
  },
  {
    id: 2,
    name: "Artificial Intelligence and Machine Learning",
    faculty: "Faculty of Engineering and Technology"
  },
  {
    id: 3,
    name: "Civil Engineering",
    faculty: "Faculty of Engineering and Technology"
  },
  {
    id: 4,
    name: "Mechanical Engineering",
    faculty: "Faculty of Engineering and Technology"
  }
];

const programmes = [
  {
    id: 1,
    name: "B.E. Computer Science and Engineering",
    level: "UG",
    department: "Computer Science and Engineering"
  },
  {
    id: 2,
    name: "B.E. Artificial Intelligence and Machine Learning",
    level: "UG",
    department: "Artificial Intelligence and Machine Learning"
  }
];

const staff = [
  {
    id: 1,
    name: "Publicly listed faculty member",
    designation: "Faculty",
    department: "Computer Science and Engineering"
  }
];

// --------------------------------------------------
// Departments API
// --------------------------------------------------

app.get("/api/departments", (req, res) => {
  res.status(200).json({
    success: true,
    count: departments.length,
    data: departments
  });
});

// --------------------------------------------------
// Programmes API
// --------------------------------------------------

app.get("/api/programmes", (req, res) => {
  res.status(200).json({
    success: true,
    count: programmes.length,
    data: programmes
  });
});

// --------------------------------------------------
// Staff API
// --------------------------------------------------

app.get("/api/staff", (req, res) => {
  res.status(200).json({
    success: true,
    count: staff.length,
    data: staff
  });
});

// --------------------------------------------------
// Examinations API
// --------------------------------------------------

app.get("/api/examinations", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Examination information endpoint",
    data: []
  });
});

// --------------------------------------------------
// Notices API
// --------------------------------------------------

app.get("/api/notices", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Public university notices endpoint",
    data: []
  });
});

// --------------------------------------------------
// Placements API
// --------------------------------------------------

app.get("/api/placements", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement information endpoint",
    data: []
  });
});

// --------------------------------------------------
// AI Question Endpoint
// --------------------------------------------------

app.post("/api/ask", (req, res) => {
  const question = req.body.question;

  if (!question || typeof question !== "string") {
    return res.status(400).json({
      success: false,
      error: "Question is required"
    });
  }

  const cleanedQuestion = question.trim();

  if (cleanedQuestion.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Question cannot be empty"
    });
  }

  res.status(200).json({
    success: true,
    question: cleanedQuestion,
    answer:
      "Your question was received. The AI answer engine will be connected next.",
    source: "AU Help AI"
  });
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, HOST, () => {
  console.log("----------------------------------------");
  console.log(`${APP_NAME} v${APP_VERSION}`);
  console.log("----------------------------------------");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("----------------------------------------");
});
