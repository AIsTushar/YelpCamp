const express = require("express");
const router = express.Router({ mergeParams: true });

// Utils
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

// Models
const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");

// Controller
const reviewController = require("../controllers/reviewController");

// post a review
router.post("/", isLoggedIn, validateReview, reviewController.createReview);

// delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
