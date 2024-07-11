const mongoose = require("mongoose");
const generateHelper = require("../../../helper/generate.helper");


const userSchema = new mongoose.Schema({
  fullName: String,
  avata: String,
  email: String,
  password: String,
  tonken: {
    type: String,
    default: generateHelper.generateRandomChar(25),
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Boolean,
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;