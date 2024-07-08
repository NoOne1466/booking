const catchAsync = require("../utils/catchAsync");
const factory = require("./../_common/handlerFactory");
const bookingRoomOrderModel = require("./bookingRoomOrder.model");

exports.bookRoom = catchAsync(async (req, res, next) => {
  const { hotelId, roomType, startDate, endDate } = req.body;
  const booked = await bookingRoomOrderModel.bookRoom(
    hotelId,
    roomType,
    startDate,
    endDate
  );
  console.log(booked);
  if (!booked) {
    res.status(400).json({
      status: "failed",
    });
  }
  res.status(200).json({
    status: "success",
    data: booked,
  });
});
