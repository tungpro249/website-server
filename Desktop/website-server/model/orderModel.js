const mongoose = require("mongoose");

const order = new mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
    unique: true,
  },
  user_id: {
    type: Number,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: Number,
    trim: true,
  },
  status: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("Order", order);
