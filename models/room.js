const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	const Room = sequelize.define(
		"Room",
		{
			title: DataTypes.STRING,
		},
		{
			sequelize,
			timestamps: true,
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
