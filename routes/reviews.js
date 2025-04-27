const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const { reviewSchema } = require("../schemas");
const {
  validateJoiSchema,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

router.post(
  "/",
  isLoggedIn,
  validateJoiSchema(reviewSchema),
  catchAsync(reviews.createReview)
);

module.exports = router;
