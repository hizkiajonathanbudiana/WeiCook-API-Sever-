const { User, Cuisine, Category } = require("../models");

class CuisineController {
  static async handleCreatePost(req, res, next) {
    try {
      const { name, description, price, imgUrl, categoryId, authorId } =
        req.body;

      const response = await Cuisine.create({
        name,
        description,
        price,
        imgUrl,
        categoryId,
        authorId,
      });

      res.status(201).json({ createdPost: response });
    } catch (error) {
      next(error);
    }
  }

  static async showPost(req, res, next) {
    try {
      const posts = await Cuisine.findAll({
        include: [
          { model: User, attributes: { exclude: ["password"] } },
          { model: Category },
        ],
      });

      res.status(200).json({ cuisinePosts: posts });
    } catch (error) {
      next(error);
    }
  }

  static async showPostDetails(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Cuisine.findByPk(id, {
        include: [
          { model: User, attributes: { exclude: ["password"] } },
          { model: Category },
        ],
      });

      if (!post) throw new Error("NO_POST_ID");
      res.status(200).json({ postDetails: post });
    } catch (error) {
      next(error);
    }
  }

  static async handleUpdatePost(req, res, next) {
    try {
      const { name, description, price, imgUrl, categoryId, authorId } =
        req.body;

      if (!(await Cuisine.findByPk(id))) throw new Error("NO_POST_ID");

      await Cuisine.update(
        { name, description, price, imgUrl, categoryId, authorId },
        { where: { id: id } }
      );

      const post = await Cuisine.findByPk(id);

      res.status(200).json({ updatedPost: post });
    } catch (error) {
      next(error);
    }
  }

  static async handleDeletePost(req, res, next) {
    try {
      const { id } = req.params;

      const post = await Cuisine.findByPk(id);

      const postName = post.name;

      if (!post) throw new Error("NO_POST_ID");

      await Cuisine.delete({ where: { id: id } });

      res.status(200).json({ msg: `${postName} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async x(req, res, next) {
    try {
      res.status(200).json({ x: "hi" });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CuisineController;
