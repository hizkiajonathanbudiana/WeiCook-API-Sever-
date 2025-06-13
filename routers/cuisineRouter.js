const express = require("express");
const router = express.Router();
const { protectorPosts, protectorAdmin } = require("../middlewares/middleware");
//controllers
const CuisineController = require("../controllers/cuisineController");

//multer
const multer = require("multer");

//cuisine
router.post(
  "/",
  multer({ storage: multer.memoryStorage() }).single("image"),
  protectorAdmin,
  CuisineController.handleCreatePost
);
router.put(
  "/:id",
  multer({ storage: multer.memoryStorage() }).single("image"),
  protectorPosts,
  CuisineController.handleUpdatePost
);
router.delete("/:id", protectorPosts, CuisineController.handleDeletePost);

router.patch(
  "/:id",
  multer({ storage: multer.memoryStorage() }).single("image"),
  protectorPosts,
  CuisineController.handleUpdateImage
);

module.exports = router;
