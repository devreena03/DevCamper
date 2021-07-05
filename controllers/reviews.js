const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    GET all Reviews for a bootcamp
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviewsForBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.params.bootcampId);
  if (req.params.bootcampId) {
    req.query.bootcamp = req.params.bootcampId;
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    GET single Review by Id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`No Review with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: review });
});

// @desc    Add a review for bootcamp
// @route   POST /api/v1/Reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const bootcampid = req.params.bootcampId;
  req.body.bootcamp = bootcampid;
  req.body.user = req.user.id;
  console.log(req.body);

  const bootcamp = await Bootcamp.findById(bootcampid);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id ${bootcampid}`, 404)
    );
  }
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    body: review,
  });
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }

  if (review.user != req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to update the resource`, 403)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc    Delete a Reviews
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }
  if (review.user != req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete the resource `, 403)
    );
  }
  review.remove();
  res.status(202).json({ success: true, data: {} });
});
