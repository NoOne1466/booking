const Ticket = require("./bookingFlight.model");
const { PaymentGateway, paymobAPI } = require("../services/PaymentGetaway.js");
const AppError = require("../utils/appError.js");

const catch1Async = require("./../utils/catchAsync");
exports.createTicket = catch1Async(async (req, res, next) => {
  const tickedBooked = await Ticket.bookTicket(req, next);
  if (!tickedBooked)
    return next(
      new AppError(
        "There was an error while booking the ticket try again later",
        401
      )
    );

  const paymentGateway = new PaymentGateway(
    paymobAPI,
    process.env.API_KEY,
    process.env.INTEGRATION_ID
  );
  await paymentGateway.getToken();

  const paymobOrder = await paymentGateway.createOrder({
    id: tickedBooked._id,
    priceInCents: tickedBooked.priceInCents,
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

  tickedBooked.orderId = paymobOrder.id;

  const paymentURL = process.env.IFRAME_URL.replace("{{TOKEN}}", paymentToken);

  res.status(201).json({
    status: "success",
    tickedBooked,
    paymentGateway: paymentURL,
  });
});
