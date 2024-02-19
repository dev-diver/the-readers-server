const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");
const initBookModel = (sequelize, DataTypes) => {
	const Book = sequelize.define(
		"Book",
		{
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			urlName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			totalPage: {
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
	);

	Book.associate = (models) => {
		Book.belongsToMany(models.Room, { through: "Room_Book" });
		Book.belongsToMany(models.User, { through: "User_Book" });
		Book.belongsToMany(models.User, { through: "Chart" });

		Book.hasMany(models.Highlight, { foreignKey: "bookId", sourceKey: "id" });
	};

	return Book;
};

module.exports = initBookModel(sequelize, DataTypes);
