const OneWayOrder = require("./oneWayOrder.schema");
const RoundTripOrder = require("./roundTripOrder.schema");

const OneWayTicket = require("./oneWayTicket.schema");
const RoundTripTicket = require("./roundTripTicket.schema");

const Flight = require("./../flights/flight.schema");
const AppError = require("../utils/appError");

class Ticket {
  static async bookTicket(req, next) {
    const flight = await Flight.findById(req.body.flight);
    // console.log(req.body);
    if (!flight) return next(new AppError("Flight not found", 404));

    // const validSeatClasses = ["economy", "business", "firstClass"];

    // if (!validSeatClasses.includes(req.body.seatClass)) {
    //   return next(new AppError("Invalid seat class", 400));
    // }

    if (flight[req.body.seatClass] <= 0) {
      return next(
        new AppError("The seat you want is not available for this flight", 400)
      );
    }

    flight[req.body.seatClass] -= 1;

    await flight.save();

    req.body.price = flight.prices[req.body.seatClass];

    if (req.body.type === "one-way") {
      // Create a one-way ticket
      const oneWayOrder = await OneWayOrder.create({
        user: req.user.id,
        flight: req.body.flight,
        plane: flight.plane,
        seatClass: req.body.seatClass,
        departureDate: flight.departureDate,
        priceInCents: req.body.price * 100,
      });

      return { oneWayOrder };
    } else if (req.body.type === "round-trip") {
      // Find the corresponding return flight on the same plane
      const returnFlight = await Flight.findOne({
        plane: flight.plane,
        from: flight.to,
        to: flight.from,
        departureDate: {
          $gte: new Date(flight.departureDate).setHours(0, 0, 0, 0),
        },
      });

      if (!returnFlight) {
        return next(new AppError("Return flight not found", 404));
      }

      if (returnFlight[req.body.seatClass] <= 0) {
        return next(
          new AppError(
            "The seat you want is not available for the return flight",
            400
          )
        );
      }

      // Deduct one seat for the return flight
      returnFlight[req.body.seatClass] -= 1;

      // Save the updated return flight
      await returnFlight.save();

      req.body.returnPrice = returnFlight.prices[req.body.seatClass];

      // Create a round-trip ticket
      const roundTripOrder = await RoundTripOrder.create({
        user: req.user.id,
        outboundFlight: req.body.flight,
        returnFlight: returnFlight._id,
        plane: flight.plane,
        seatClass: req.body.seatClass,
        outboundDate: flight.departureDate,
        returnDate: returnFlight.departureDate,
        priceInCents: (req.body.price + req.body.returnPrice) * 100,
      });

      return { roundTripOrder };
    }
  }
  static async refund(req, next) {
    let order = null;
    let ticket = await OneWayTicket.findById(req.body.ticketId);
    if (ticket) {
      ticket.status = "canceled";
      ticket.cancellationReason = req.body.cancellationReason;
      await ticket.save();

      order = await OneWayOrder.findOne({
        user: ticket.user,
        flight: ticket.flight,
        seatClass: ticket.seatClass,
        departureDate: ticket.departureDate,
        isPaid: true,
      });
      console.log("One way ticket", ticket);
      console.log("order", order);

      return order;
    }
    ticket = await RoundTripTicket.findById(req.body.ticketId);
    if (ticket) {
      ticket.status = "canceled";
      ticket.cancellationReason = req.body.cancellationReason;
      await ticket.save();
      order = await RoundTripOrder.findOne({
        user: ticket.user,
        outboundFlight: ticket.outboundFlight,
        returnFlight: ticket.returnFlight,
        seatClass: ticket.seatClass,
        outboundDate: ticket.outboundDate,
        returnDate: ticket.returnDate,
        isPaid: true,
      });
      console.log("round trip ticket", ticket);
      console.log("order", order);
      return order;
    }
    return next(new AppError("The id provided is not related to a ticket"));
  }
  static async getAllTickets() {
    const oneWayTickets = await OneWayTicket.find().lean().exec();
    const roundTripTickets = await RoundTripTicket.find().lean().exec();

    const tickets = [
      ...oneWayTickets.map((ticket) => ({ ...ticket, type: "one-way" })),
      ...roundTripTickets.map((ticket) => ({ ...ticket, type: "round-trip" })),
    ];

    tickets.sort(
      (a, b) => new Date(a.departureDate) - new Date(b.departureDate)
    );

    return tickets;
  }
  static async getAllTicketsForCurrentUser(req) {
    const userId = req.user._id;
    const oneWayTickets = await OneWayTicket.find({ user: userId })
      .lean()
      .exec();
    const roundTripTickets = await RoundTripTicket.find({ user: userId })
      .lean()
      .exec();

    const tickets = [
      ...oneWayTickets.map((ticket) => ({ ...ticket, type: "one-way" })),
      ...roundTripTickets.map((ticket) => ({ ...ticket, type: "round-trip" })),
    ];

    tickets.sort(
      (a, b) => new Date(a.departureDate) - new Date(b.departureDate)
    );

    return tickets;
  }
}

module.exports = Ticket;
