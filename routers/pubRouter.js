const express = require("express");
const router = express.Router();

//controllers
const CuisineController = require("../controllers/cuisineController");
const CategoryController = require("../controllers/categoryController");

//public
router.get("/cuisines", CuisineController.showPost);
router.get("/cuisines/:id", CuisineController.showPostDetails);
router.get("/categories", CategoryController.showCategories);

module.exports = router;
