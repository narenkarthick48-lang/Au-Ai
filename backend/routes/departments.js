const express = require("express");

const router = express.Router();

// Public department data.
// Keep this limited to information that is publicly available.
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

// GET /api/departments
router.get("/", (req, res) => {
  try {
    const { search, faculty } = req.query;

    let result = [...departments];

    if (search) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((department) =>
        department.name.toLowerCase().includes(keyword)
      );
    }

    if (faculty) {
      const facultyName = faculty.trim().toLowerCase();

      result = result.filter(
        (department) =>
          department.faculty.toLowerCase() === facultyName
      );
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error("Department route error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve department information"
    });
  }
});

// GET /api/departments/:id
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid department ID"
      });
    }

    const department = departments.find(
      (item) => item.id === id
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error("Department lookup error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve department"
    });
  }
});

module.exports = router;
