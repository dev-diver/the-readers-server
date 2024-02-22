const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initChartModel = (sequelize, DataTypes) => {
	const Chart = sequelize.define(
		"Chart",
		{
			// 기본 키로 사용될 id 필드 정의
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Users", // 'User' 테이블을 참조
					key: "id",
				},
			},
			BookId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Books", // 'Book' 테이블을 참조
					key: "id",
				},
			},
			// page: {
			// 	type: DataTypes.INTEGER, // 페이지 번호
			// 	allowNull: false, // 페이지 번호는 필수이므로 null을 허용하지 않음
			// },
			// time: {
			// 	type: DataTypes.INTEGER, // 시간
			// 	allowNull: false, // 시간은 필수이므로 null을 허용하지 않음
			// },
			// 기타 필드 정의
			totalPage: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			// indexes: [
			// 	{
			// 		unique: true,
			// 		fields: ["UserId", "BookId", "page"],
			// 	},
			// ],
			sequelize,
			modelName: "Chart",
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);

	Chart.associate = (models) => {
		Chart.hasMany(models.Page, { foreignKey: "ChartId" });
		// 	Chart.hasMany(models.Book, { foreignKey: "BookId", sourceKey: "id" });
		// 	Chart.hasMany(models.User, { foreignKey: "UserId", sourceKey: "id" });
	};

	return Chart;
};

module.exports = initChartModel(sequelize, DataTypes);
