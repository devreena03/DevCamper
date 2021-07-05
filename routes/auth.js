const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/auth");

const User = require("../models/User");

const router = express.Router();

const { protect } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, getMe);

// router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
