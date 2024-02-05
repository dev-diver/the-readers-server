const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initOuterlinkModel = (sequelize, DataTypes) => {
	const Outerlink = sequelize.define(
		"Outerlink",
		{
			url: {
				type: DataTypes.STRING,
				allowNull: false,
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
	Outerlink.associate = (models) => {
		// Outerlink가 Highlight에 속하는 관계 설정
		Outerlink.belongsTo(models.Highlight, {
			foreignKey: "highlightId", // Outerlink 테이블에 추가될 외래 키
		});
	};

	return Outerlink;
};
module.exports = initOuterlinkModel(sequelize, DataTypes);
