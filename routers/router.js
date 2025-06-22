const express = require("express");
const router = express.Router();

//controllers
const UserController = require("../controllers/userController");

//prefixRouter
const pubRouter = require("./pubRouter");
const categoryRouter = require("./categoryRouter");
const cuisineRouter = require("./cuisineRouter");

//middlewares
const { protectorLogin, protectorAdmin } = require("../middlewares/middleware");

//redirect /
router.get("/", async (req, res, next) => {
  try {
    res.redirect("/pub/cuisines");
  } catch (error) {
    next(error);
  }
});

//login
router.post("/login", UserController.handleLogin);

//public
router.use("/pub", pubRouter);

//middleware global login
router.use(protectorLogin);

//auth buat front end
router.get("/auth/me", protectorLogin, (req, res) => {
  res.status(200).json({ user: req.dataUser });
});

//register with protectorAdmin
router.post("/register", protectorAdmin, UserController.handleRegister);

//category
router.use("/categories", categoryRouter);

//cuisine
router.use("/cuisines", cuisineRouter);

module.exports = router;
