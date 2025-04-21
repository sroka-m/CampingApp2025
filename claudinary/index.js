const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const ExpressError = require("../utils/ExpressError");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "YelpCamp",
    // allowedFormats: ["jpeg", "png", "jpg"], //does not work
    format: async (req, file) => {
      if (!allowedFormats.includes(file.mimetype)) {
        throw new ExpressError(
          `only files of mimetype ${allowedFormats.join(",")} are allowed`,
          400
        );
      }
    },
  },
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "YelpCamp",
//     allowedFormats: ["jpeg", "png", "jpg"],
//   },
// });

module.exports = {
  storage,
  cloudinary,
};
