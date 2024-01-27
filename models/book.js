const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require(__dirname + "/../config/db.js");

const Book = sequelize.define(
  "book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: false,
    modelName: "Book",
    tableName: "Books",
    paranoid: true,
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

module.exports = Book;
