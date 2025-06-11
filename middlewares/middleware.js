//helpers
const { convertPayloadToToken } = require("../helpers/jwt");

//models
const { User } = require("../models/index");

const protectorLogin = async function (req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("UNAUTHENTICATED");
    }

    const token = authorization.split(" ")[1];

    const payload = convertPayloadToToken(token);

    const foundUser = await User.findByPk(payload.id);

    if (!founduser) {
      throw new Error("UNAUTHENTICATED");
    }

    req.dataTambahan = {
      id: foundUser.id,
      username: foundUser.username,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protectorLogin };
