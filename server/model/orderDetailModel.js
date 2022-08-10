const mongoose = require("mongoose");

const orderDetail = new mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
    unique: true,
  },
  product_id: {
    type: Number,
    require: true,
    unique: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
});
module.exports = mongoose.model("OrderDetail", orderDetail);
