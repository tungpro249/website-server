const mongoose = require("mongoose");

const category = new mongoose.Schema(
  {
    category_id: {
      type: Number,
      require: true,
      unique: true,
    },
    category_name: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", quantity);
