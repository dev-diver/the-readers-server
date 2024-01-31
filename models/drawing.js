const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");
const initDrawingModel = (sequelize, DataTypes) => {
	const Drawing = sequelize.define(
		"Drawing",
		{
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bookId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			roomId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			pageNum: {
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
			indexes: [
				{
					fields: ["pageNum"],
				},
			],
		}
	);

	Drawing.associate = (models) => {
		Drawing.belongsTo(models.Book, { foreignKey: "bookId", targetKey: "id" });
		Drawing.belongsTo(models.Room, { foreignKey: "roomId", targetKey: "id" });
		Drawing.belongsToMany(models.User, { through: "User_Drawing" });
	};

	return Drawing;
};

module.exports = initDrawingModel(sequelize, DataTypes);
