module.exports = function (numOfPages, page) {
  let iterStrt; //integer to start interation at
  let span = 5; //number of links ot be displayed, i works with odd or even, but it looks better if the span is odd

  if (numOfPages <= span) {
    iterStrt = 1;
    span = numOfPages;
  } else {
    iterStrt =
      page <= Math.ceil(span / 2)
        ? 1
        : page > numOfPages - Math.ceil(span / 2)
        ? numOfPages - span + 1
        : page - Math.floor(span / 2);
  }

  return {
    numOfPages: numOfPages,
    iterStrt: iterStrt, //integer to start interation at
    span: span, //number of links ot be displayed, i works with odd or even, but it looks better if the span is odd
  };
};
