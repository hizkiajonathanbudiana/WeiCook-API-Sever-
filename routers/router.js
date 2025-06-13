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

//login
router.post("/login", UserController.handleLogin);

//public
router.use("/pub", pubRouter);

//middleware global login
router.use(protectorLogin);

//register with protectorAdmin
router.post("/register", protectorAdmin, UserController.handleRegister);

//category
router.use("/categories", categoryRouter);

//cuisine
router.use("/cuisines", cuisineRouter);

module.exports = router;
