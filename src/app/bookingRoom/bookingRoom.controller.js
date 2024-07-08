const catchAsync = require("../utils/catchAsync");
const factory = require("./../_common/handlerFactory");
const bookingRoomModel = require("./bookingRoom.model");
const { PaymentGateway, paymobAPI } = require("../services/PaymentGetaway.js");

exports.bookRoom = catchAsync(async (req, res, next) => {
  const { hotelId, roomType, startDate, endDate } = req.body;
  const booked = await bookingRoomModel.bookRoom(
    hotelId,
    roomType,
    startDate,
    endDate,
    req.user.id
  );
  console.log("booked ==> ", booked);
  if (!booked) {
    res.status(400).json({
      status: "failed",
    });
  }

  const paymentGateway = new PaymentGateway(
    paymobAPI,
    process.env.API_KEY,
    process.env.INTEGRATION_ID
  );
  await paymentGateway.getToken();

  const paymobOrder = await paymentGateway.createOrder({
    id: booked._id,
    priceInCents: booked.priceInCents,
    name: "hotel",
    description: "accommodation",
  });

  console.log(req.user);
  const paymentToken = await paymentGateway.createPaymentGateway({
    uEmail: req.user.email,
    uFirstName: req.user.firstName,
    uLastName: req.user.lastName,
    uPhoneNumber: req.user.phoneNumber,
  });

  booked.orderId = paymobOrder.id;
  console.log(booked);

  const paymentURL = process.env.IFRAME_URL.replace("{{TOKEN}}", paymentToken);

  res.status(200).json({
    status: "success",
    data: booked,
    paymentGateway: paymentURL,
  });
});
