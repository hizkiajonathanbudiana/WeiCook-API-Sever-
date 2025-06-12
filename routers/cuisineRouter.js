const express = require("express");
const router = express.Router();

//controllers
const CuisineController = require("../controllers/cuisineController");

//multer
const multer = require("multer");

//cuisine
router.post(
  "/",
  multer({ storage: multer.memoryStorage() }).single("image"),
  CuisineController.handleCreatePost
);
router.put(
  "/:id",
  multer({ storage: multer.memoryStorage() }).single("image"),
  CuisineController.handleUpdatePost
);
router.delete("/:id", CuisineController.handleDeletePost);

module.exports = router;
