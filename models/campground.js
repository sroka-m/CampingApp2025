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

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

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
