const User = require("./user.schema");
const factory = require("./../_common/handlerFactory");

// exports.getAll = async (req, res, next) => {
//   const user = await User.getAll();
//   console.log(user);
//   res.json(user);
// };

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// asdasd
// Do NOT update passwords with this!\
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.createUser = factory.createOne(User);
exports.updateMe = factory.updateMe(User);
exports.deleteMe = factory.deleteMe(User);
exports.getMe = factory.getMe;
exports.homePage = factory.homePage;