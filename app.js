if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("node:path");
favicon = require("serve-favicon");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
const User = require("./models/user");
// const Joi = require("joi"); we dont need it any more. only when creating schema
const passport = require("passport");
const LocalStrategy = require("passport-local");

const dbUrl = process.env.DB_URL;
//  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  // await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("connection opened");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express();
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

//mongoUrl: "mongodb://127.0.0.1:27017/yelpCamp", for deployment
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("session store error", e);
});
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());

app.use(helmet());
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const connectSrcUrls = ["https://api.maptiler.com/"];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.unsplash.com/",
        "https://api.maptiler.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
//make sure that u use sassion before u se the passport.session as it relies on that
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log("before the session");
  // console.log(req.originalUrl);
  //i had to put the "/campgrounds/API" last, othersie the path is expected to send json, chrome complains, i think its a bug
  // req.originalUrl is .well-known/appspecific/com.chrome.devtools.json
  if (
    ![
      "/login",
      "/register",
      "/",
      "/campgrounds/:id/reviews/:reviewId",
      "/campgrounds/API",
      "/checkExistingUsers/API",
    ].includes(req.originalUrl)
  ) {
    // console.log("in the session");
    req.session.returnTo = req.originalUrl;
    // console.log(req.originalUrl);
    // console.log(req.session.returnTo);
  }

  ////////////////////////////////////////////////////////////////////
  // if (
  //   !["/login", "/register", "/", "/campgrounds/API"].includes(
  //     req.originalUrl
  //   ) &&
  //   !req.originalUrl.includes("reviews")
  // ) {
  //   req.session.returnTo = req.originalUrl;
  //   // console.log(req.session.returnTo);
  // }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/dog", (req, res) => {
  res.render("dog");
});

// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 505 } = err;
  if (!err.message) err.message = "Something went wrong";
  //i did it because upload.array("image", 4) in multer 1.xx gives"Unexpected field" fixed, in version 2 but not out yet
  if (err.message == "Unexpected field") {
    err.message = "Number of files must not exceed 4";
  }
  // console.log(err);
  // console.log(err.stack);
  res.status(status).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`listening at ${port}`);
});
