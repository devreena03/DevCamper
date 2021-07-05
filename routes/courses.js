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

router.route("/").get(advancedResults(Course), getCourses).post(createCourse);

router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
