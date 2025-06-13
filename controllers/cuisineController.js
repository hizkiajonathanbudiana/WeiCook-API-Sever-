const { User, Cuisine, Category } = require("../models");
const uploadToCloudinary = require("../helpers/cloudinary");
const { Op, where } = require("sequelize");

class CuisineController {
  static async handleCreatePost(req, res, next) {
    try {
      const { name, description, price, categoryId, authorId } = req.body;

      if (!req.file) throw new Error("NO_IMG");

      const imgUrl = await uploadToCloudinary(req.file, name);
      console.log(imgUrl);

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
      const { search, filter, sort } = req.query;
      let { page } = req.query;

      const options = {
        include: [
          { model: User, attributes: { exclude: ["password"] } },
          { model: Category },
        ],
        order: [["id", "ASC"]],
      };

      if (search || filter) {
        options.where = {};
      }

      if (search) {
        options.where.name = { [Op.iLike]: `%${search}%` };
      }

      if (filter) {
        options.where.categoryId = { [Op.eq]: filter };
      }

      if (sort === "ASC") {
        options.order = [["createdAt", "ASC"]];
      }

      if (sort === "DESC") {
        options.order = [["createdAt", "DESC"]];
      }

      if (!page) {
        page = 1;
      }

      const limit = 10;
      options.limit = limit;
      options.offset = (page - 1) * limit;

      const { count, rows } = await Cuisine.findAndCountAll(options);

      res.status(200).json({
        total: count,
        size: limit,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      });
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
      const { id } = req.params;

      const { name, description, price, categoryId, authorId } = req.body;

      if (!req.file) throw new Error("NO_IMG");

      const imgUrl = await uploadToCloudinary(req.file, name);

      await Cuisine.update(
        { name, description, price, imgUrl, categoryId, authorId },
        { where: { id: id } }
      );

      const afterUpdate = await Cuisine.findByPk(id);

      res.status(200).json({ updatedPost: afterUpdate });
    } catch (error) {
      next(error);
    }
  }

  static async handleDeletePost(req, res, next) {
    try {
      const { id } = req.params;

      const post = await Cuisine.findByPk(id);

      if (!post) throw new Error("NO_POST_ID");

      const postName = post.name;

      await Cuisine.destroy({ where: { id: id } });

      res.status(200).json({ message: `${postName} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async handleUpdateImage(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.file) throw new Error("NO_IMG");

      const post = await Cuisine.findByPk(id);

      if (!post) throw new Error("NO_POST_ID");

      const imgUrl = await uploadToCloudinary(req.file, post.name);

      await Cuisine.update({ imgUrl }, { where: { id: id } });

      res.status(200).json({
        message: `Image ${post.name} success to update, link: ${imgUrl}`,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CuisineController;
