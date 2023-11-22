const express = require("express");
const router = express.Router();

// Utils
const passport = require("passport");

// Controller
const userController = require("../controllers/userController");

// Sign up route
router
  .route("/signup")
  .get(userController.getSignupForm)
  .post(userController.signup);

const loginAuth = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/users/login",
  keepSessionInfo: true,
});

router
  .route("/login")
  .get(userController.getLoginForm)
  .post(loginAuth, userController.login);

router.get("/logout", userController.logout);

module.exports = router;
