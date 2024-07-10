const { PaymentGateway, paymobAPI } = require("../services/PaymentGetaway.js");

const Booking = require("./../bookingRoom/bookingRoom.schema.js");
const OrderRoom = require("./../bookingRoom/bookingRoomOrder.schema.js");

const Ticket = require("./../bookingFlight/bookingFlight.schema.js");

const catchAsync = require("../utils/catchAsync.js");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const fs = require("fs");

exports.webhook = catchAsync(async (req, res, next) => {
  console.log("paymob");
  const paymobAns = req.body;
  const hmac = req.query.hmac;

  if (!hmac) return next(new AppError("HMAC is required", 400));
  if (!paymobAns) return next(new AppError("Invalid request", 400));
  if (!PaymentGateway.verifyHmac(paymobAns, hmac, process.env.HMAC_SECRET))
    return next(new AppError("Invalid HMAC", 400));

  if (paymobAns.type !== "TRANSACTION") {
    return res.status(200).json({
      status: "success",
    });
  }
  console.log(JSON.stringify(paymobAns));

  if (paymobAns.obj.success !== true)
    return next(new AppError("Transaction failed", 400));

  const orderId = paymobAns?.obj?.order?.merchant_order_id;
  let order;

  order = await OrderRoom.findByIdAndUpdate(
    orderId,
    {
      isPaid: true,
      transactionId: paymobAns?.obj?.id,
      paidAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (order) {
    const Booking = new Booking({
      user: order.user,
      hotel: order.hotel,
      roomType: order.roomType,
      startDate: order.startDate,
      endDate: order.endDate,
      price: order.priceInCents / 100,
    });
    await Booking.save();
    return res.status(200).json({
      status: "success",
    });
  }

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // return res.status(200).json({
  //   status: "success",
  // });
});

exports.test = function () {
  console.log("test test test");
};
