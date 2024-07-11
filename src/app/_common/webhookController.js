const { PaymentGateway, paymobAPI } = require("../services/PaymentGetaway.js");

const Booking = require("./../bookingRoom/bookingRoom.schema.js");
const OrderRoom = require("./../bookingRoom/bookingRoomOrder.schema.js");

const OneWayOrder = require("../bookingFlight/oneWayOrder.schema.js");
const RoundTripOrder = require("../bookingFlight/roundTripOrder.schema");
const OneWayTicket = require("../bookingFlight/oneWayTicket.schema")``;
const RoundTripTicket = require("../bookingFlight/roundTripTicket.schema.js");

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
    const booking = await Booking.create({
      user: order.user,
      hotel: order.hotel,
      roomType: order.roomType,
      startDate: order.startDate,
      endDate: order.endDate,
      price: order.priceInCents / 100,
    });
    await booking.save();
    return res.status(200).json({
      status: "success",
    });
  }

  // one way payment
  order = await OneWayOrder.findByIdAndUpdate(
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
  console.log(order);
  if (order) {
    const oneWayTicket = await OneWayTicket.create({
      user: order.user,
      hotel: order.hotel,
      roomType: order.roomType,
      startDate: order.startDate,
      endDate: order.endDate,
      price: order.priceInCents / 100,
    });
    await oneWayTicket.save();

    return res.status(200).json({
      status: "success",
      order,
    });
  }
  // round trip payment
  order = await RoundTripOrder.findByIdAndUpdate(
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
  console.log(order);

  if (order) {
    const ticket = await RoundTripTicket.create({
      user: order.user,
      hotel: order.hotel,
      roomType: order.roomType,
      startDate: order.startDate,
      endDate: order.endDate,
      price: order.priceInCents / 100,
    });
    await ticket.save();

    return res.status(200).json({
      status: "success",
      order,
    });
  }

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  return res.status(200).json({
    status: "success",
  });
});
