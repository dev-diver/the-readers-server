const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initRoomModel = (sequelize, DataTypes) => {
	const Room = sequelize.define(
		"Room",
		{
			title: DataTypes.STRING,
		},
		{
			sequelize,
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);

	Room.associate = (models) => {
		Room.belongsToMany(models.Book, { through: "Room_Book" });
		Room.belongsToMany(models.User, { through: "Room_User" });
	};

	return Room;
};

module.exports = initRoomModel(sequelize, DataTypes);
