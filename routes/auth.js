const express = require("express");
const { register } = require("../controllers/auth");

const User = require("../models/User");

const router = express.Router();

router.route("/").get(getUser).post(register);

// router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
