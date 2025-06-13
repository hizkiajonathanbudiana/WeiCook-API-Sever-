const { comparePassword } = require("../helpers/bcrypt");
const {
  convertPayloadToToken,
  convertTokenToPayload,
} = require("../helpers/jwt");

const { User } = require("../models");

class UserController {
  static async handleRegister(req, res, next) {
    try {
      // console.log(req.body);
      if (req.dataUser.role !== "Admin") throw new Error("FORBIDDEN");
      if (req.dataUser.role !== "Admin") {
        throw new Error("FORBIDDEN");
      }
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

      res.status(201).json({
        message: `User with id ${response.id} successfully created !`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("NO_USERNAME_OR_PASSWORD");
      }

      const foundUser = await User.findOne({ where: { email: email } });

      if (!foundUser) throw new Error("INVALID_USERNAME_OR_PASSWORD");

      if (!(await comparePassword(password, foundUser.password))) {
        throw new Error("INVALID_USERNAME_OR_PASSWORD");
      }

      const payload = {
        id: foundUser.id,
      };

      const token = convertPayloadToToken(payload);

      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
