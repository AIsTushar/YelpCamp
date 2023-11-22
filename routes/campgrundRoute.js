const express = require("express");
const router = express.Router();

// Utils
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Controllers
const campgroundController = require("../controllers/campgroundController");

// Campgrounds Routes
// Get all the campgrounds and post a new campground

router
  .route("/")
  .get(campgroundController.getAllCampgrounds)
  .post(campgroundController.createNewCampground);
// .post(
//   isLoggedIn,
//   upload.array("image"),
//   validateCampground,
//   campgroundController.createNewCampground
// );

// Get the new form for create a new campground
router.get("/new", isLoggedIn, campgroundController.getNewCampgroundForm);

// Get the edit form for campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  campgroundController.getCampgroundEditForm
);

// Get a single campground by id && Update a campground Delete a campground
router
  .route("/:id")
  .get(campgroundController.getSingleCampground)
  .put(
    isLoggedIn,
    validateCampground,
    isAuthor,
    campgroundController.updateCampground
  )
  .delete(isLoggedIn, isAuthor, campgroundController.deleteCampground);

module.exports = router;
