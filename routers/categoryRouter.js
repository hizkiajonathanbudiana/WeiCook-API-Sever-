const express = require("express");
const router = express.Router();

//controllers
const CategoryController = require("../controllers/categoryController");

//multer
const multer = require("multer");

//category
router.get("/", CategoryController.showCategories);
router.post("/create", CategoryController.handleCreateCategory);
router.put("/update/:id", CategoryController.handleUpdateCategory);
router.delete("/delete/:id", CategoryController.handleDeleteCategory);

module.exports = router;
