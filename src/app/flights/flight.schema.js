const mongoose = require("mongoose");
const Plane = require("./../planes/planes.schema");

const flightSchema = new mongoose.Schema({
  plane: {
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
  economy: {
    type: Number,
    // required: true,
  },
  business: {
    type: Number,
    // required: true,
  },
  firstClass: {
    type: Number,
    // required: true,
  },
  prices: {
    economy: {
      type: Number,
      required: true,
    },
    business: {
      type: Number,
      required: true,
    },
    firstClass: {
      type: Number,
      required: true,
    },
  },
});
flightSchema.pre("save", async function (next) {
  const flight = this;

  if (flight.isNew) {
    const plane = await Plane.findById(flight.plane);
    if (plane) {
      flight.economy = plane.seats.economy;
      flight.business = plane.seats.business;
      flight.firstClass = plane.seats.firstClass;
    }
  }

  // console.log(flight);
  next();
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
