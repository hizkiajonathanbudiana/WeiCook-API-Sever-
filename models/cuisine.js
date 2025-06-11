"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuisine.belongsTo(models.User, {
        foreignKey: "authorId",
      });

      Cuisine.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
    }
  }
  Cuisine.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name cant empty",
          },
          notEmpty: {
            msg: "Name cant empty",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description cant empty",
          },
          notEmpty: {
            msg: "Description cant empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price cant empty",
          },
          notEmpty: {
            msg: "Price cant empty",
          },
          min: {
            args: [1_000],
            msg: "Minimal price is Rp. 1.000,00",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image cant empty",
          },
          notEmpty: {
            msg: "Image cant empty",
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Category cant empty",
          },
          notEmpty: {
            msg: "Category cant empty",
          },
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Author cant empty",
          },
          notEmpty: {
            msg: "Author cant empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cuisine",
    }
  );
  return Cuisine;
};
