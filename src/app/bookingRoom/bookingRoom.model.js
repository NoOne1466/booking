const cron = require("node-cron");
const Hotels = require("./../hotels/hotels.schema");
const AppError = require("./../utils/appError");
const Booking = require("./bookingRoom.schema");
const catchAsync = require("./../utils/catchAsync");

class BookingRoom {
  static async checkAvailability(hotelId, roomType, startDate, endDate) {
    const hotel = await Hotels.findById(hotelId);

    if (!hotel) {
      throw new AppError("Hotel not found", 404);
    }

    const room = hotel.room.find((r) => r.type === roomType);

    if (!room) {
      throw new AppError("Room type not found", 404);
    }

    const bookings = await Booking.find({
      hotel: hotelId,
      roomType: roomType,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    });

    const bookedRooms = bookings.length;

    if (bookedRooms >= room.totalRooms) {
      return false;
    }

    return true;
  }
  static async bookRoom(hotelId, roomType, startDate, endDate) {
    const isAvailable = await this.checkAvailability(
      hotelId,
      roomType,
      startDate,
      endDate
    );

    if (!isAvailable) {
      throw new AppError("No rooms available for the selected dates", 406);
    }

    const booking = new Booking({
      hotel: hotelId,
      roomType: roomType,
      startDate: startDate,
      endDate: endDate,
    });

    await booking.save();

    return booking;
  }
}

module.exports = BookingRoom;
