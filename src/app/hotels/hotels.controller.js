const Hotels = require("./hotels.schema");
const factory = require("./../_common/handlerFactory");

exports.getHotel = factory.getOne(Hotels);
exports.getAllHotelss = factory.getAll(Hotels);
exports.updateHotels = factory.updateOne(Hotels);
exports.deleteHotels = factory.deleteOne(Hotels);
exports.createHotels = factory.createOne(Hotels);
