const User = require("./user.schema");

class User {
  static async getAll() {
    const doc = await User.find();
    // console.log(doc);
  }
}

module.exports = User;
