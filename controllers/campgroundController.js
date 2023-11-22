// Utils
const catchAsync = require("../utils/catchAsync");

// Models
const Campground = require("../models/campgroundModel");

// Get All Campgrounds
module.exports.getAllCampgrounds = catchAsync(async (req, res) => {
  const allCampgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds: allCampgrounds });
});

// Get the new form for create a new campground
module.exports.getNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

// CREATE NEW CAMPGROUND
module.exports.createNewCampground = catchAsync(async (req, res) => {
  res.send(req.files);
});

// Get a single campground by id
module.exports.getSingleCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});

// Get the edit form for a single campground
module.exports.getCampgroundEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
});

// UPDATE CAMPGROUND
module.exports.updateCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
});

// DELETE CAMPGROUND
module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
});
