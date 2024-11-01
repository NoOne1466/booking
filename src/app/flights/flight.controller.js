const Flight = require("./flight.schema");
const flightModel = require("./flight.model");
const Plane = require("./../planes/planes.schema");
const factory = require("./../_common/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getFlight = factory.getOne(Flight);
exports.getAllFlight = factory.getAll(Flight);
exports.updateFlight = factory.updateOne(Flight);
exports.deleteFlight = factory.deleteOne(Flight);

exports.createFlight = catchAsync(async (req, res, next) => {
  const plane = await Plane.findById(req.body.plane);
  if (!plane) return next(new AppError("Plane not found", 404));

  const correctFrom = await flightModel.checkState(req.body.from);
  const correctTo = await flightModel.checkState(req.body.to);
  if (!correctFrom || !correctTo) {
    return next(new AppError("Re-check your cities", 400));
  }

  const sameDayFlights = await flightModel.validateFlight(req, next);
  if (!sameDayFlights)
    return next(new AppError("error creating the flight", 400));

  await flightModel.createOne(req, res, next);
});

// factory.createOne(Flight);
