const { campgroundSchema, reviewSchema, userSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  //console.log(`current user ${req.user}`);password gives us an access to req.user
  // console.log(req.url);
  // console.log(req.originalUrl);

  if (!req.isAuthenticated()) {
    //it is a fix, we assign the session in the app.use instead
    // req.session.returnTo = req.originalUrl;
    // console.log(`inside isAuthenticated ${req.session.returnTo}`);
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    // console.log(`${res.locals.returnTo} this is insdie storeReturnTo`);
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  //joi schema acts before data is saved to mongo
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  //joi schema acts before data is saved to mongo
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUser = (req, res, next) => {
  //joi schema acts before data is saved to mongo
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "you dont have permissions");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "you dont have permissions");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
