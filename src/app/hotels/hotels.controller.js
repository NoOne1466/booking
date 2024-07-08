const Hotel = require("./hotels.schema.js");
const factory = require("./../_common/handlerFactory");

exports.getHotel = factory.getOne(Hotel);
exports.getAllHotels = factory.getAll(Hotel);
exports.updateHotels = factory.updateOne(Hotel);
exports.deleteHotels = factory.deleteOne(Hotel);
exports.createHotels = factory.createOne(Hotel);
