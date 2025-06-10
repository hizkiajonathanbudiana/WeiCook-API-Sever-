const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { convertPayloadToToken } = require("../helpers/jwt");

const { User } = require("../models/index");
//register
router.post("/register", UserController.handleRegister);

//login
router.post("/login", UserController.handleLogin);

router.use(async (req, res, next) => {
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
    next(err);
  }
});

module.exports = router;
