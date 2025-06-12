const express = require("express");
const router = express.Router();

//controllers
const CuisineController = require("../controllers/cuisineController");

//public
router.get("/cuisine", CuisineController.showPost);
router.get("/cuisine/:id", CuisineController.showPostDetails);

module.exports = router;
