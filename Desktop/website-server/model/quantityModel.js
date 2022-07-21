const mongoose = require("mongoose");

const quantity = new mongoose.Schema(
  {
    product_id: {
      type: Number,
      require: true,
      unique: true,
    },
    size: String,
    color: String,
    quantity: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quantity", quantity);
