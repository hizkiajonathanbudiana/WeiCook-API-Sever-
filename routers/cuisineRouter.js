const express = require("express");
const router = express.Router();
const { protectorPosts } = require("../middlewares/middleware");
//controllers
const CuisineController = require("../controllers/cuisineController");

//multer
const multer = require("multer");

//cuisine
router.get("/", CuisineController.showPost);
router.get("/:id", CuisineController.showPostDetails);
router.post(
  "/",
  multer({ storage: multer.memoryStorage() }).single("image"),
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
