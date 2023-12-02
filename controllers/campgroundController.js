// Mapbox config
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAP_BOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Utils
const catchAsync = require("../utils/catchAsync");

// Models
const Campground = require("../models/campgroundModel");

// Get All Campgrounds
module.exports.getAllCampgrounds = catchAsync(async (req, res) => {
  const allCampgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds: allCampgrounds });
});

/** Get the new form for create a new campground
 *GET  /campgrounds/new
 **/
module.exports.getNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

/** Create a new campground
 *POST  /campgrounds/ "Marine Drive Waterfall, Cox's Bazar"
 **/
//
module.exports.createNewCampground = catchAsync(async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let uploadedFiles = req.files.images || [];

  if (!Array.isArray(uploadedFiles)) {
    uploadedFiles = [uploadedFiles];
  }

  const uploadedFileNames = [];

  uploadedFiles.forEach((uploadedFile, index) => {
    const fileName = `uploaded_file_${index}_${Date.now()}_${
      uploadedFile.name
    }`;
    uploadedFileNames.push(fileName);

    uploadedFile.mv(__dirname + "/../public/uploads/" + fileName, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).send(err);
      }
    });
  });

  const newCampground = new Campground(req.body);
  newCampground.geometry = geoData.body.features[0].geometry;

  const images = uploadedFileNames.map((fileName) => ({
    url: `/uploads/${fileName}`,
    filename: fileName,
  }));

  newCampground.images = images;
  newCampground.author = req.user._id;

  const savedCampground = await newCampground.save();

  res.redirect(`/campgrounds/${savedCampground._id}`);
});

/** Get a single campground by id
 *GET  /campgrounds/:id
 **/
//

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

/**   const uploadedFileNames = [];

  uploadedFiles.forEach((uploadedFile, index) => {
    const fileName = `uploaded_file_${index}_${Date.now()}_${
      uploadedFile.name
    }`;
    uploadedFileNames.push(fileName);

    uploadedFile.mv(__dirname + "/../public/uploads/" + fileName, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).send(err);
      }
    });
  });
  
  */

/** Update a new campground
 *PUT  /campgrounds/:id
 **/
//
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

  if (req.files) {
    let uploadedFiles = req.files.images || [];

    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    const uploadedFileNames = [];

    uploadedFiles.forEach((uploadedFile, index) => {
      const fileName = `uploaded_file_${index}_${Date.now()}_${
        uploadedFile.name
      }`;
      uploadedFileNames.push(fileName);

      uploadedFile.mv(__dirname + "/../public/uploads/" + fileName, (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(500).send(err);
        }
      });
    });

    const images = uploadedFileNames.map((fileName) => ({
      url: `/uploads/${fileName}`,
      filename: fileName,
    }));

    campground.images.push(...images);

    await campground.save();
  }

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
