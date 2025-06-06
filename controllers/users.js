const User = require("../models/user");
const generator = require("generate-password");

module.exports.renderRegister = (req, res) => {
  const password = generator.generate({
    length: 25, // defaults to 10
    numbers: true, // defaults to false
    symbols: true, // defaults to false
    exclude: "<>&",
  });
  res.render("users/register", { password });
};

module.exports.checkExistingUsers = async (req, res, next) => {
  try {
    let { username } = req.query;
    console.log(req.query);
    let response = { alreadyTaken: false };
    const users = await User.find({});
    for (let u of users) {
      if (u.username === username) {
        response.alreadyTaken = true;
        break;
      }
    }
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    console.log(password);
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  // console.log(`${res.locals.returnTo} redirecturl variable `);
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
