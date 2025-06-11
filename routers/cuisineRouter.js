const express = require("express");
const router = express.Router();

//controllers
const CuisineController = require("../controllers/cuisineController");

//multer
const multer = require("multer");

//cuisine
router.post(
  "/create",
  multer({ storage: multer.memoryStorage() }).single("image"),
  CuisineController.handleCreatePost
);
router.put(
  "/update/:id",
  multer({ storage: multer.memoryStorage() }).single("image"),
  CuisineController.handleUpdatePost
);
router.delete("/delete/:id", CuisineController.handleDeletePost);

module.exports = router;
