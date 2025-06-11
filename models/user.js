"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cuisine, {
        foreignKey: "authorId",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: "email already used, please choose another",
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email cant empty",
          },
          notEmpty: {
            msg: "Email cant empty",
          },
          isEmail: {
            msg: "Wrong format email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password cant empty",
          },
          notEmpty: {
            msg: "Password cant empty",
          },
          len: {
            args: [5],
            msg: "Password length minimal is 5",
          },
        },
      },
      role: { type: DataTypes.STRING, defaultValue: "Staff" },
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await hashPassword(user.password);
        },
      },
    }
  );
  return User;
};
