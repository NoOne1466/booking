const UserSchema = require("./user.schema");

class User {
  static async getAll() {
    const doc = await UserSchema.find();
    console.log(doc);
  }
}

module.exports = User;
