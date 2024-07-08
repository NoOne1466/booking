const cron = require("node-cron");
const Booking = require("./../bookingRoom/bookingRoom.schema");
const Hotel = require("./../hotels/hotels.schema");

const updateRoomAvailability = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({ startDate: today });

    for (const booking of bookings) {
      await Hotel.findOneAndUpdate(
        { _id: booking.hotel, "room.type": booking.roomType },
        { $inc: { "room.$.availableRooms": -1 } }
      );
    }

    console.log("Room availability updated successfully");
  } catch (error) {
    console.error("Error updating room availability:", error);
  }
};

// Schedule the job to run at midnight every day
cron.schedule("0 0 * * *", updateRoomAvailability);

module.exports = updateRoomAvailability;
