const mongoose = require("mongoose");

const planeSchema = new mongoose.Schema({
  planeName: {
    type: String,
    required: true,
  },
  numberOfPassengers: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
});

const Plane = mongoose.model("Plane", planeSchema);

module.exports = Plane;
