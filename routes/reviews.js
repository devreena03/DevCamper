const express = require("express");
const {
  getReviewsForBootcamp,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middlewares/advancedResult");

const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(advancedResults(Review, "bootcamp"), getReviewsForBootcamp)
  .post(protect, authorize("user"), addReview);

router
  .route("/:id")
  .get(getReviewById)
  .put(protect, authorize("user"), updateReview)
  .delete(protect, authorize("user"), deleteReview);

module.exports = router;
