const Campground = require("../models/campground");
const { cloudinary } = require("../claudinary");
const ExpressError = require("../utils/ExpressError");
const dateDiffAprox = require("../utils/dateDiffAprox");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const mapkey = maptilerClient.config.apiKey;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  campgrounds.reverse();
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new", { mapkey });
};

//virtuals do not seem to work if u map over the objects, so i had to create a property
module.exports.campgroundsAPI = async (req, res) => {
  const campgrounds = await Campground.find({});
  const campgroundsGeo = {
    features: campgrounds.map((camp) => {
      return {
        geometry: {
          coordinates: camp.geometry.coordinates,
        },
        properties: {
          popUpMarkup: `<strong><a href="/campgrounds/${camp.id}">${camp.title}</a></strong>`,
        },
      };
    }),
  };
  res.json(campgroundsGeo);
};

module.exports.createCampground = async (req, res, next) => {
  if (req.files.length === 0) {
    throw new ExpressError("Please upload a file", 400);
  }

  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  if (geoData.features.length === 0) {
    for (let file of req.files) {
      await cloudinary.uploader.destroy(file.filename);
    }
    throw new ExpressError(
      "Location not found. Please consider checking spelling or format.",
      400
    );
  }

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;

  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  campground.currDate = new Date();
  await campground.save();
  // console.log(campground);
  req.flash("success", "Successfuly created campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  campground.reviews.reverse();
  let average;
  if (campground.reviews.length > 0) {
    average =
      campground.reviews.reduce((total, review) => {
        return total + review.rating;
      }, 0) / campground.reviews.length;
    average = average.toFixed(1);
  }

  // const then = new Date("2025-05-10T05:48:21.396Z");
  const dateDiffCreated = dateDiffAprox(new Date(campground.currDate));
  // console.log(campground);
  res.render("campgrounds/show", {
    campground,
    dateDiffCreated,
    average,
    dateDiffAprox,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground, mapkey });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  //why spreading it, we are not mutaning req.body.campgound, we copy it
  // console.log(req.body.campground);
  // console.log({ ...req.body.campground });

  const campground = await Campground.findById(id);
  //req.body.deleteImages  is undefined when it is empty, whereas  req.files has length when it is empty
  if (
    req.body.deleteImages &&
    campground.images.length -
      req.body.deleteImages.length +
      req.files.length ===
      0
  ) {
    throw new ExpressError("Please upload an image", 400);
  } else if (
    (req.body.deleteImages &&
      campground.images.length -
        req.body.deleteImages.length +
        req.files.length >
        4) ||
    (!req.body.deleteImages && campground.images.length + req.files.length > 4)
  ) {
    for (let file of req.files) {
      await cloudinary.uploader.destroy(file.filename);
    }
    throw new ExpressError("Total image count cannot exceed 4", 400);
  }
  await campground.updateOne(
    { ...req.body.campground },
    { runValidators: true }
  );
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );

  campground.geometry = geoData.features[0].geometry;

  // const campground = await Campground.findByIdAndUpdate(
  //   id,
  //   { ...req.body.campground },
  //   { new: true, runValidators: true }
  // );
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Successfuly updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
