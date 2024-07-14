const Admin = require("./admin.schema.js");
const factory = require("./../_common/handlerFactory.js");

exports.getAdmin = factory.getOne(Admin);
exports.getAllAdmins = factory.getAll(Admin);

// Do NOT update passwords with this!
exports.updateAdmin = factory.updateOne(Admin);
exports.deleteAdmin = factory.deleteOne(Admin);

// exports.createAdmin = factory.createOne(Admin);

exports.getAdminById = factory.getOne(Admin);
exports.updateMe = factory.updateMe(Admin);
exports.deleteMe = factory.deleteMe(Admin);
exports.getMe = factory.getMe;

exports.homePage = factory.homePage;
