const mongoose = require("mongoose");
const Review = require("./reviewModel");

const schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new schema(
  {
    title: String,
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        require: true,
      },
      coordinates: {
        type: [Number],
        require: true,
      },
    },
    author: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
