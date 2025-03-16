const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(catchAsync(campgounds.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgounds.createCampground)
  );

router.get("/new", isLoggedIn, campgounds.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgounds.renderEditForm)
);

router
  .route("/:id")
  .get(catchAsync(campgounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgounds.deleteCampground));

module.exports = router;
