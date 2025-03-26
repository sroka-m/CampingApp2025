let images = [
  "https://res.cloudinary.com/dkdvjhxic/image/upload/v1742935107/YelpCamp/hgbmukzn8xesvwimgihx.jpg",
  "https://res.cloudinary.com/dkdvjhxic/image/upload/v1742921365/YelpCamp/dfcpklboimxz2ch8w01p.png",
];

let newString = images.map((i) =>
  i.replace("/upload/", "/upload/c_fill,h_200,w_300/")
);

console.log(newString);
