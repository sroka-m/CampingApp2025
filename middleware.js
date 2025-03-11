module.exports.isLoggedIn = (req, res, next) => {
  //console.log(`current user ${req.user}`);password gives us an access to req.user
  console.log(req.url);
  console.log(req.originalUrl);

  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    console.log(`${res.locals.returnTo} this is insdie storeReturnTo`);
  }
  next();
};
