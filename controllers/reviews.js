const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.indexReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  //i would need to sort them soon
  //need to calc % for star reivews before i pull out the review made by the user, as it also contributes to the numbers
  campground.reviews.reverse();
  // console.log(campground.reviews);
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

  const starDesc = ["Terrible", "Not good", "Average", "Very good", "Amazing"];

  res.render("reviews/index", {
    reviews: campground.reviews,
    campgroundID: campground._id,
    title: campground.title,
    userReview,
    starDesc,
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
