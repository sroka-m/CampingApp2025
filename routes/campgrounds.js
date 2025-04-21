const express = require("express");
const multer = require("multer");
// const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
//aitomatically looks for index.js file
const { storage } = require("../claudinary");
// const upload = multer({ storage: storage });

//filefiler doesn not work, it throws an error, but the image is still uploaded to cloudinary
const MAXFILESIZE = 1024 ** 2 * 3;
// const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
const upload = multer({
  storage: storage,
  limits: { fileSize: MAXFILESIZE },
  // fileFilter: (req, file, cb) => {
  //   if (!allowedFormats.includes(file.mimetype)) {
  //     cb(new ExpressError("only jpeg/png/jpg images allowed!", 400));
  //   }

  //   cb(null, true);
  // },
});

router
  .route("/")
  .get(catchAsync(campgounds.index))
  .post(
    isLoggedIn,
    upload.array("image", 4),
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
    upload.array("image", 4),
    validateCampground,
    catchAsync(campgounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgounds.deleteCampground));

module.exports = router;
