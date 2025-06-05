const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const commonPassArr = [
  "yelpcamp",
  "1234567890",
  "password1",
  "passw0rd1",
  "123456789",
  "12345678",
  "password",
  "passw0rd",
  "qwerty123",
  "1qaz2wsx",
  "zaq1zaq1",
  "iloveyou",
  "1q2w3e4r",
  "qwertyuiop",
  "!@#$%^*(",
  "!@#$%^*()",
  "princess",
  "1q2w3e4r5t",
];

const commonPasswords = (value, helpers) => {
  for (let i = 0; i < commonPassArr.length; i++) {
    if (value.toLowerCase() === commonPassArr[i]) {
      throw new ExpressError("Common passwords are no accepted", 400);
    }
  }
};
const notTaken = async (value, hepers) => {
  const users = await User.find({});
  for (let u of users) {
    if (u.username === value) {
      throw new ExpressError("Username already taken", 400);
    }
  }
};

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

//joi validation does not like \d for numbers
module.exports.userSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,20}$"))
    .escapeHTML()
    .external(notTaken, "custom validation")
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required().escapeHTML(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=^\\S)(?=.*\\S$)(?=^.{8,64}$)(?=^(?:(?!<).)*$)(?=^(?:(?!>).)*$)(?=^(?:(?!&).)*$).*$"
      )
    )
    .escapeHTML()
    .custom(commonPasswords, "custom validation")
    .not(Joi.ref("username"))
    .required(),
}).required();
