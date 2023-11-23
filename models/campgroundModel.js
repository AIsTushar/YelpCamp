const mongoose = require("mongoose");
const Review = require("./reviewModel");

const schema = mongoose.Schema;

const campgroundSchema = new schema({
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
