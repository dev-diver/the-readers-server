const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initOuterslinkModel = (sequelize, DataTypes) => {
	const Outerlinks = sequelize.define(
		"Outerlinks",
		{
			url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			note: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Outerlink",
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);
	Outerlinks.associate = (models) => {
		// Outerlink가 Highlight에 속하는 관계 설정
		Outerlinks.belongsTo(models.Highlight, {
			foreignKey: "highlightId", // Outerlink 테이블에 추가될 외래 키
		});
	};

	return Outerlinks;
};
module.exports = initOuterslinkModel(sequelize, DataTypes);
