const { User, Cuisine, Category } = require("../models");

class CategoryController {
  static async handleCreateCategory(req, res, next) {
    try {
      const { name } = req.body;

      const category = await Category.create({ name });

      res.status(201).json({ createdCategory: category });
    } catch (error) {
      next(error);
    }
  }

  static async showCategories(req, res, next) {
    try {
      const categories = await Category.findAll();

      res.status(200).json({ categories: categories });
    } catch (error) {
      next(error);
    }
  }

  static async handleUpdateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!(await Category.findByPk(id))) throw new Error("NO_CATEGORY_ID");

      await Category.update({ name }, { where: { id: id } });

      const category = await Category.findByPk(id);

      res.status(200).json({ updatedCategory: category });
    } catch (error) {
      next(error);
    }
  }

  static async handleDeleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) throw new Error("NO_CATEGORY_ID");

      const categoryName = category.name;

      await Category.destroy({ where: { id: id } });

      res.status(200).json({ msg: `${categoryName} success to delete` });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CategoryController;
