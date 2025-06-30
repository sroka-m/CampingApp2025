const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
// const cities = require("./cities");
const citiesUK = require("./gb");
const { descriptors, places } = require("./seedHelpers");

main().catch((err) => console.log(err));
async function main() {
  //NOTE: AFTER MONGO.NET/ IN THE URL U NEED TO SPECIFY THE NAME OF THE DB, FOR THIS APP "tEST", .env DB_URL_SEEDING
  // await mongoose.connect("//mongodb://127.0.0.1:27017/yelpCamp");
  await mongoose.connect();
  console.log("connection opened");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//seeding UK
const imgCloud = [
  "lagnvenlkcxyzlnglidd",
  "buspesm5oml8xzhf1zzb",
  "hoqbhjkds3ctgk4z2fce",
  "lobmebr9norw58clqg1e",
  "jex8tcghnlzo4pfxeztq",
  "pxyhc1jukvq1fltez5fa",
  "a40q1s3b2l6v03kuxvcy",
];
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedsDB_UK = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 100; i++) {
    //gb.json has length 258
    const picRand = Math.floor(Math.random() * imgCloud.length);
    const randomCityArr = Math.floor(Math.random() * 258);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${citiesUK[randomCityArr].city}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [citiesUK[randomCityArr].lng, citiesUK[randomCityArr].lat],
      },
      currDate: new Date(),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore cum minus, culpa debitis aliquam voluptatum incidunt quod. Placeat ipsa veritatis voluptate ex dignissimos repudiandae, asperiores earum, explicabo officia tempore error!",
      price,
      //author: "68544902e37fa9e7d8966121", //for local linux
      author: "6855a7de8459f1ab37511c69",
      //for local dev
      //  images: [
      //   {
      //     url: "https://res.cloudinary.com/dkdvjhxic/image/upload/v1742239480/YelpCamp/sqrpvg8hszb5amsqtwtb.png",
      //     filename: "YelpCamp/sqrpvg8hszb5amsqtwtb",
      //   },
      // ],
      images: [
        {
          url: `https://res.cloudinary.com/dkdvjhxic/image/upload/v1742239480/YelpCamp/${imgCloud[picRand]}`,
          filename: `YelpCamp/${imgCloud[picRand]}`,
        },
      ],
    });
    await camp.save();
  }
};
seedsDB_UK().then(() => {
  mongoose.connection.close();
});

//seeding US
// const sample = (array) => array[Math.floor(Math.random() * array.length)];
// const seedsDB = async () => {
//   await Campground.deleteMany({});
//   await Review.deleteMany({});
//   for (let i = 0; i < 50; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const price = Math.floor(Math.random() * 20) + 10;
//     const camp = new Campground({
//       location: `${cities[random1000].city}, ${cities[random1000].state}`,
//       title: `${sample(descriptors)} ${sample(places)}`,
//       geometry: {
//         type: "Point",
//         coordinates: [
//           cities[random1000].longitude,
//           cities[random1000].latitude,
//         ],
//       },
//       currDate: new Date(),
//       description:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore cum minus, culpa debitis aliquam voluptatum incidunt quod. Placeat ipsa veritatis voluptate ex dignissimos repudiandae, asperiores earum, explicabo officia tempore error!",
//       price,
//       author: "67d0940f650b2f6d7eb85dc7",
//       images: [
//         {
//           url: "https://res.cloudinary.com/dkdvjhxic/image/upload/v1742239480/YelpCamp/sqrpvg8hszb5amsqtwtb.png",
//           filename: "YelpCamp/sqrpvg8hszb5amsqtwtb",
//         },
//       ],
//     });
//     await camp.save();
//   }
// };
// seedsDB().then(() => {
//   mongoose.connection.close();
// });
