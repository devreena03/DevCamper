const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    GET all Courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  console.log(req.params.bootcampId);
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    // query = Course.find().populate("bootcamp"); //pull all bootcamp data

    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    GET single Courses by Id
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @desc    Create a course for bootcamp
// @route   POST /api/v1/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  const bootcampid = req.params.bootcampId;
  req.body.bootcamp = bootcampid;
  console.log(req.body);

  const bootcamp = await Bootcamp.findById(bootcampid);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id ${bootcampid}`, 404)
    );
  }
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    body: course,
  });
});

// @desc    Update a Course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Delete a Bootcamps
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }

  res.status(202).json({ success: true, data: {} });
});
