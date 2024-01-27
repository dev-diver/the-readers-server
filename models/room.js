const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require(__dirname + "/../config/db.js");
const Book = require("./book");
const User = require("./user");

const Room = sequelize.define(
  "Room",
  {
    booknameId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.STRING(40),
      references: {
        model: User,
        key: "email",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: false,
    modelName: "Room",
    tableName: "Rooms",
    paranoid: true,
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

Room.belongsTo(Book, {
  foreignKey: "booknameId",
});

Room.belongsTo(User, {
  foreignKey: "userId",
});
