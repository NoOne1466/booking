const Plane = require("./../planes/planes.schema");
const Flight = require("./flight.schema");
const factory = require("./../_common/handlerFactory");
const fs = require("fs");
const AppError = require("../utils/appError");
const data = JSON.parse(
  fs.readFileSync("/home/hamza/Tickets/src/app/_common/airports.json", "utf8")
);

class FlightModel {
  static async checkState(state) {
    let check = false;
    const stateToLower = state.toLowerCase();
    for (const el in data) {
      const x = data[el].state.toLowerCase();
      // console.log(x, stateToLower);
      if (x == stateToLower) {
        check = true;
        return true;
      }
    }
    console.log(check);
    return false;
  }
  static async validateFlight(req, next) {
    const date = new Date(req.body.departureDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    console.log(startOfDay, endOfDay);

    // Find flights for the same plane on the same day
    const flightsOnSameDay = await Flight.find({
      planeId: req.body.planeId,
      departureDate: { $gte: startOfDay, $lte: endOfDay },
    });

    console.log("flights ", flightsOnSameDay);
    // Check if there are already two flights for the same plane on the same day
    if (flightsOnSameDay.length >= 2) {
      return next(
        new AppError(
          "This plane already has 2 flights scheduled for this day",
          400
        )
      );
    }

    if (flightsOnSameDay.length === 0) {
      return true;
    }

    const lastFlight = flightsOnSameDay[flightsOnSameDay.length - 1];
    console.log(lastFlight);
    if (lastFlight.to !== req.body.from) {
      return next(
        new AppError(
          `The plane landed in ${lastFlight.to}, it cant leave in the same day from another city`,
          400
        )
      );
    }
    return true;
  }
  static async createOne(req, res, next) {
    if (req.file) req.body.photo = `img/${req.file.filename}`;

    const doc = await Flight.create(req.body);

    // console.log(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  }
}
module.exports = FlightModel;
