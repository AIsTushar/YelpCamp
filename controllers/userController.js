// Models
const User = require("../models/userModel");

// Utils
const AppError = require("../utils/appError"); // Apperror insted of ExpressError
const catchAsync = require("../utils/catchAsync");

// Render signup page
module.exports.getSignupForm = async (req, res) => {
  res.render("users/signup");
};

// Create a new user
module.exports.signup = catchAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(new AppError(err.message, 500));
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/users/signup");
  }
});

// Render login page
module.exports.getLoginForm = (req, res) => {
  res.render("users/login");
};

// Login
module.exports.login = catchAsync(async (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

// logout
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/campgrounds");
  });
};
