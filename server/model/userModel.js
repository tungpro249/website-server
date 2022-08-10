const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    product_id: {
      type: Number,
      require: true,
      unique: true,
    },
    user_name: {
      type: String,
      trim: true,
      require: true,
    },
    first_name: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    role: {
      type: String,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
