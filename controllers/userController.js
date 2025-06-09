const { User } = require("../models");

class UserController {
  static async handleRegister(req, res) {
    try {
      console.log(req.body);

      const { username, email, password, phoneNumber, address } = req.body;

      const response = await User.create({
        username,
        email,
        password,
        phoneNumber,
        address,
      });

      if (!response) {
        throw new Error("USER_CREATE_FAILED");
      }

      res
        .status(201)
        .json({ msg: `User with id ${response.id} successfully created !` });
    } catch (error) {
      console.log(error);
      let code = 500;
      let msg = "Internal Server Error";

      if (error.message === "USER_CREATE_FAILED") {
        code = 400;
        msg = "Bad Request";
      }

      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const err = error.errors.map((el) => el.message);
        code = 400;
        msg = err;
      }

      res.status(code).json({ error: msg });
    }
  }
}

module.exports = UserController;
