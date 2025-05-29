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

//prefix /campgrounds/:id/reviews"

router
  .route("/:reviewId")
  .patch(isLoggedIn, isReviewAuthor, catchAsync(reviews.updateReview))
  .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

router
  .route("/")
  .get(catchAsync(reviews.indexReview))
  .post(
    isLoggedIn,
    validateJoiSchema(reviewSchema),
    catchAsync(reviews.createReview)
  );

module.exports = router;
