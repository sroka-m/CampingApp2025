const express = require("express");
const multer = require("multer");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn, validateJoiSchema, isAuthor } = require("../middleware");
//aitomatically looks for index.js file
const { storage } = require("../claudinary");
// const upload = multer({ storage: storage });

//filefiler doesn not work !allowedFormats.includes(file.mimetype, it throws an error, but the image is still uploaded to cloudinary
const MAXFILESIZE = 1024 ** 2 * 3;
// const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];

//cannot use validateJoiSchema and pass the campgroundSchema becase i need to do adhere to the format required by the fileFilter
//with fileFilter in place when req.body is rejected, pics wont be added to cloudinary, it must be return cb, or else does not work
const fileFilter = (req, file, cb) => {
  const { error } = campgroundSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return cb(
      new ExpressError(error.details.map((e) => e.message).join(", "), 404),
      false
    );
  }
  cb(null, true);
};
const upload = multer({
  fileFilter,
  limits: { fileSize: MAXFILESIZE },
  storage: storage,
  // fileFilter: (req, file, cb) => {
  //   if (!allowedFormats.includes(file.mimetype)) {
  //     cb(new ExpressError("only jpeg/png/jpg images allowed!", 400));
  //   }

  //   cb(null, true);
  // },
});

router.route("/").get(catchAsync(campgrounds.index)).post(
  isLoggedIn,
  upload.array("image", 4),
  // validateJoiSchema(campgroundSchema),
  catchAsync(campgrounds.createCampground)
);
// .post(upload.array("image"), (req, res) => {
//   console.log(req.body);
//   console.log(req.files[0].filename);
//   console.log(req.files[0].size);
//   console.log(req.files[0].path);
//   // res.send(req.body, req.file);
//   res.send("good");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router.get("/API", catchAsync(campgrounds.campgroundsAPI));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image", 4),
    // validateJoiSchema(campgroundSchema),
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
