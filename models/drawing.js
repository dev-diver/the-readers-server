const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");
const initDrawingModel = (sequelize, DataTypes) => {
	const Drawing = sequelize.define(
		"Drawing",
		{
			urlName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bookId: {
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
	// Drawing은 Book은 1 대 다 관계이고, User와는 다 대 다 관계임
	// 하나의 Drawing은 하나의 책과 방에 속하고 또 여러 사용자에게 속할 수 있음
	Drawing.associate = (models) => {
		Drawing.belongsTo(models.Book, { foreignKey: "bookId", targetKey: "id" });
		Drawing.belongsToMany(models.User, { through: "User_Drawing" });
	};

	return Drawing;
};

module.exports = initDrawingModel(sequelize, DataTypes);
