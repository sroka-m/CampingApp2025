const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("connection opened");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedsDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore cum minus, culpa debitis aliquam voluptatum incidunt quod. Placeat ipsa veritatis voluptate ex dignissimos repudiandae, asperiores earum, explicabo officia tempore error!",
      price,
      author: "67d0940f650b2f6d7eb85dc7",
      images: [
        {
          url: "https://res.cloudinary.com/dkdvjhxic/image/upload/v1742239480/YelpCamp/sqrpvg8hszb5amsqtwtb.png",
          filename: "YelpCamp/sqrpvg8hszb5amsqtwtb",
        },
      ],
    });
    await camp.save();
  }
};
seedsDB().then(() => {
  mongoose.connection.close();
});
