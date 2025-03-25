const express = require("express");
const multer = require("multer");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
//aitomatically looks for index.js file
const { storage } = require("../claudinary");
const upload = multer({ storage: storage });

router
  .route("/")
  .get(catchAsync(campgounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgounds.createCampground)
  );
// .post(upload.array("image"), (req, res) => {
//   console.log(req.body);
//   console.log(req.files[0].filename);
//   console.log(req.files[0].size);
//   console.log(req.files[0].path);
//   // res.send(req.body, req.file);
//   res.send("good");
// });

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
    upload.array("image"),
    validateCampground,
    catchAsync(campgounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgounds.deleteCampground));

module.exports = router;
