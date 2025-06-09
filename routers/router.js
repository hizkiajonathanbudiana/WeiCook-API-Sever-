const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

//register
router.post("/register", UserController.handleRegister);

module.exports = router;
