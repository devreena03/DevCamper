const express = require("express");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });
const advancedResults = require("../middlewares/advancedResult");
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(advancedResults(Course), getCourses)
  .post(protect, authorize("publisher", "admin"), createCourse);

router
  .route("/:id")
  .get(getCourseById)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
