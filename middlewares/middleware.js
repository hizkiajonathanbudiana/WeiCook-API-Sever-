//helpers
const { convertTokenToPayload } = require("../helpers/jwt");

//models
const { User, Cuisine, Category } = require("../models");

const protectorLogin = async function (req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("UNAUTHENTICATED");
    }

    const token = authorization.split(" ")[1];

    const payload = convertTokenToPayload(token);

    const foundUser = await User.findByPk(payload.id);

    if (!foundUser) {
      throw new Error("UNAUTHENTICATED");
    }

    req.dataUser = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const protectorAdmin = async function (req, res, next) {
  try {
    if (req.dataUser.role !== "Admin") throw new Error("FORBIDDEN");

    next();
  } catch (error) {
    next(error);
  }
};

const protectorPosts = async function (req, res, next) {
  try {
    const { id } = req.params;

    const post = await Cuisine.findByPk(id);

    if (!post) throw new Error("NO_POST_ID");

    if (req.dataUser.role !== "Admin") {
      if (req.dataUser.id !== post.authorId) {
        throw new Error("FORBIDDEN");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protectorLogin, protectorAdmin, protectorPosts };
