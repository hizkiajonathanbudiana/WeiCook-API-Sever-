const express = require("express");
const router = express.Router();

//controllers
const CategoryController = require("../controllers/categoryController");

//category
router.get("/", CategoryController.showCategories);
router.post("/", CategoryController.handleCreateCategory);
router.put("/:id", CategoryController.handleUpdateCategory);
router.delete("/:id", CategoryController.handleDeleteCategory);

module.exports = router;
