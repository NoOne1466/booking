const FlightOrder = require("./bookingFlightOrder.schema");
const Flight = require("./../flights/flight.schema");
const AppError = require("../utils/appError");
class Ticket {
  static async bookTicket(req, next) {
    const flight = await Flight.findById(req.body.flight);
    // console.log(req.body);
    if (!flight) return next(new AppError("Flight not found", 404));

    const validSeatClasses = ["economy", "business", "firstClass"];

    if (!validSeatClasses.includes(req.body.seatClass)) {
      return next(new AppError("Invalid seat class", 400));
    }

    if (flight[req.body.seatClass] <= 0) {
      return next(
        new AppError("The seat you want is not available for this flight", 400)
      );
    }

    flight[req.body.seatClass] -= 1;
    await flight.save();

    req.body.price = flight.prices[req.body.seatClass];

    const ticket = await FlightOrder.create({
      user: req.user.id,
      flight: req.body.flight,
      seatClass: req.body.seatClass,
      priceInCents: req.body.price * 100,
      departureDate: flight.departureDate,
    });
    await ticket.save();
    // console.log(flight);
    // console.log(req.body);
    return ticket;
  }
}

module.exports = Ticket;
