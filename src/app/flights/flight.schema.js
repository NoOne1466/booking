const mongoose = require("mongoose");
const flightSchema = new mongoose.Schema({
  planeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plane",
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  flyingTime: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  flightNumber: {
    type: Number,
    required: true,
  },
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
