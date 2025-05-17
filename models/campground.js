const mongoose = require("mongoose");
const Review = require("./review");
const { cloudinary } = require("../claudinary");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//On a 32-inch screen, 12vh (12 viewport height) would correspond to roughly 108 pixels so we ought to be good
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload/", "/upload/c_fill,h_200,w_300/");
});

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    currDate: { type: Date },
    description: String,
    location: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  opts
);
// CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
//   return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>`;
// });

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
    for (let image of doc.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
