const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users");
const { userSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
// const { storeReturnTo, validateUser } = require("../middleware");
// const { storeReturnTo, validateJoiSchema } = require("../middleware");
const { storeReturnTo, validateUserAsync } = require("../middleware");
const user = require("../models/user");

router
  .route("/register")
  .get(users.renderRegister)
  // .post(validateJoiSchema(userSchema), catchAsync(users.register));
  .post(catchAsync(validateUserAsync), catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
