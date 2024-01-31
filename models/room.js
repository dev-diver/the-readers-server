const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initRoomModel = (sequelize, DataTypes) => {
	const Room = sequelize.define(
		"Room",
		{
			title: {
				type: DataTypes.STRING(40),
				allowNull: true,
			},
			usermax: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	); // Add closing parenthesis here

	Room.associate = (models) => {
		Room.belongsToMany(models.Book, { through: "Room_Book" });
		Room.belongsToMany(models.User, { through: "Room_User" });
	};

	return Room;
};

module.exports = initRoomModel(sequelize, DataTypes);
