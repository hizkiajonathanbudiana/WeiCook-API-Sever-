const express = require("express");
const router = express.Router();

//controllers
const UserController = require("../controllers/userController");
const CuisineController = require("../controllers/cuisineController");
const CategoryController = require("../controllers/categoryController");

//middlewares
const { protectorLogin } = require("../middlewares/middleware");

//register
router.post("/register", UserController.handleRegister);

//login
router.post("/login", UserController.handleLogin);

//middleware global login
// router.use(protectorLogin);

//category
router.post("/category/create", CategoryController.handleCreateCategory);
router.get("/category", CategoryController.showCategories);
router.put("/category/update/:id", CategoryController.handleUpdateCategory);
router.delete("/category/delete/:id", CategoryController.handleDeleteCategory);

//cuisine
router.post("/cuisine/create", CuisineController.handleCreatePost);
router.get("/cuisine", CuisineController.showPost);
router.put("cuisine/update/:id", CuisineController.handleUpdatePost);
router.delete("/cuisine/delete/:id", CuisineController.handleDeletePost);

module.exports = router;
