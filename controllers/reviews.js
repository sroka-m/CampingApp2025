const Campground = require("../models/campground");
const Review = require("../models/review");
const dateDiffAprox = require("../utils/dateDiffAprox");

module.exports.indexReview = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.query;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  campground.reviews.reverse();

  //need to calc % for star reivews and avg before pull out userReview from the reviews
  //averageForStars, round up to 0.5 but integer.0 must be just integer (starability modified accepts only e.g. 1 and 1.5 but not 1.0)
  let average;
  let averageForStars;
  if (campground.reviews.length > 0) {
    average =
      campground.reviews.reduce((total, review) => {
        return total + review.rating;
      }, 0) / campground.reviews.length;
    averageForStars = Math.round(average * 2) / 2;
    //first determine averageForStars using unrounded average then round the average for template (not much difference, but still)
    average = average.toFixed(1);
  }
  //only if the user is logged in, check if he already made a review
  let userReview;
  if (res.locals.currentUser) {
    let index = campground.reviews.findIndex(function (review) {
      // i could return this or use equal review.author._id.valueOf() == res.locals.currentUser._id.valueOf()
      return review.author.equals(res.locals.currentUser);
    });
    if (index !== -1) {
      userReview = campground.reviews.splice(index, 1);
    }
  }
  //if query then sort the camground.reviews by the # of stars once the userReview is spliced, thats why we dont pull from DB onlt the query rev, but everyting
  if (rating) {
    campground.reviews = campground.reviews.filter(function (review) {
      return review.rating == Number(rating);
    });
  }
  // console.log(campground.reviews);

  const starDesc = ["Terrible", "Not good", "Average", "Very good", "Amazing"];

  res.render("reviews/index", {
    reviews: campground.reviews,
    campgroundID: campground._id,
    title: campground.title,
    userReview,
    starDesc,
    dateDiffAprox,
    averageForStars,
    average,
  });
};

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  // console.log(campground);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}/reviews/`);
};

module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findById(id);
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      ...req.body.review,
    },
    { new: true, runValidators: true }
  );
  res.redirect(`/campgrounds/${campground._id}/reviews/`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");

  res.redirect(`/campgrounds/${campground._id}/reviews`);
};
