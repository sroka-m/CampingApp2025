let str =
  "/campgrounds/67d1dc1f58b642ec05915e1d/reviews/67d1e107a99509e30bc2a9f9?_method=DELETE";

let result = str.split("/").pop();
console.log(result);
