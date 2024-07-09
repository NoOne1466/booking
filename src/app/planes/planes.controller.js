const Plane = require("./planes.schema");
const factory = require("./../_common/handlerFactory");

exports.getPlane = factory.getOne(Plane);
exports.getAllPlane = factory.getAll(Plane);
exports.updatePlane = factory.updateOne(Plane);
exports.deletePlane = factory.deleteOne(Plane);
exports.createPlane = factory.createOne(Plane);
