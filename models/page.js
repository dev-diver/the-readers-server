const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initPageModel = (sequelize, DataTypes) => {
	const Page = sequelize.define(
		"Page",
		{
			ChartId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Charts", // Chart 모델을 참조
					key: "id",
				},
			},
			pageNumber: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			readTime: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: "Chart",
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);

	Page.associate = (models) => {
		Page.belongsTo(models.Chart, { foreignKey: "ChartId" });
	};

	return Page;
};

module.exports = initPageModel(sequelize, DataTypes);
