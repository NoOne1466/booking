const mongoose = require("mongoose");
const AppError = require("../utils/appError");

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
  seats: {
    economy: {
      type: Number,
    },
    business: {
      type: Number,
    },
    firstClass: {
      type: Number,
    },
  },
});

planeSchema.pre("save", async function (next) {
  const plane = this;

  const totalSeats = plane.numberOfPassengers;
  const economySeats = Math.floor(totalSeats * 0.7);
  const businessSeats = Math.floor(totalSeats * 0.2);
  const firstClassSeats = totalSeats - economySeats - businessSeats;

  plane.seats.economy = economySeats;
  plane.seats.business = businessSeats;
  plane.seats.firstClass = firstClassSeats;

  next();
});
const Plane = mongoose.model("Plane", planeSchema);

module.exports = Plane;
