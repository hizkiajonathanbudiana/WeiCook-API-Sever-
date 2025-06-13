const express = require("express");
const router = express.Router();

//controllers
const CuisineController = require("../controllers/cuisineController");

//public
router.get("/cuisines", CuisineController.showPost);
router.get("/cuisines/:id", CuisineController.showPostDetails);

module.exports = router;
