const Ticket = require("./bookingFlight.model");
const { PaymentGateway, paymobAPI } = require("../services/PaymentGetaway.js");
const AppError = require("../utils/appError.js");

const catch1Async = require("./../utils/catchAsync");
exports.createTicket = catch1Async(async (req, res, next) => {
  const ticketBooked = await Ticket.bookTicket(req, next);
  if (!ticketBooked)
    return next(
      new AppError(
        "There was an error while booking the ticket try again later",
        401
      )
    );

  // console.log(ticketBooked);
  // console.log(ticketBooked.roundTriporder.priceInCents);

  const paymentGateway = new PaymentGateway(
    paymobAPI,
    process.env.API_KEY,
    process.env.INTEGRATION_ID
  );
  await paymentGateway.getToken();
  const paymobOrder = await paymentGateway.createOrder({
    id: ticketBooked?.roundTripOrder?._id || ticketBooked?.oneWayOrder?._id,
    priceInCents:
      ticketBooked?.roundTripOrder?.priceInCents ||
      ticketBooked?.oneWayOrder?.priceInCents,
    name: "flight",
    description: "accommodation",
  });

  // console.log(req.user);

  const paymentToken = await paymentGateway.createPaymentGateway({
    uEmail: req.user.email,
    uFirstName: req.user.firstName,
    uLastName: req.user.lastName,
    uPhoneNumber: req.user.phoneNumber,
  });

  if (ticketBooked.roundTripOrder) {
    ticketBooked.roundTripOrder.orderId = paymobOrder.id;
  } else {
    ticketBooked.oneWayOrder.orderId = paymobOrder.id;
  }

  const paymentURL = process.env.IFRAME_URL.replace("{{TOKEN}}", paymentToken);

  res.status(201).json({
    status: "success",
    // ticketBooked,
    paymentGateway: paymentURL,
  });
});
