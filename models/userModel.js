const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
