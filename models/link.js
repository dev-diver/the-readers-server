const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initLinkModel = (sequelize, DataTypes) => {
	const Link = sequelize.define(
		"Link",
		{
			note: {
				type: DataTypes.STRING, // 링크 간의 관계를 정의 (예: 정의, 반대 개념, 유사 개념 등)
				allowNull: true, // 메모는 필수가 아니므로 null을 허용
			},
			fromHighlightId: {
				// 하이라이트를 연결하는 출발점 ID
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Highlights", // 'Highlights' 테이블을 참조
					key: "id",
				},
			},
			toHighlightId: {
				// 하이라이트를 연결하는 도착점 ID
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Highlights", // 'Highlights' 테이블을 참조
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "Link",
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);

	Link.associate = (models) => {
		// fromHighlightId를 통한 하이라이트와의 연결
		Link.belongsTo(models.Highlight, {
			foreignKey: "fromHighlightId",
			as: "FromHighlight",
		});

		// toHighlightId를 통한 하이라이트와의 연결
		Link.belongsTo(models.Highlight, {
			foreignKey: "toHighlightId",
			as: "ToHighlight",
		});
	};

	return Link;
};

module.exports = initLinkModel(sequelize, DataTypes);
