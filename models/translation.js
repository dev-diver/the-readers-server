const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");
const initTranslationModel = (sequelize, DataTypes) => {
	const Translation = sequelize.define(
		"Translation",
		{
			text: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ sequelize, timestamps: false, underscored: false, paranoid: true, charset: "utf8", collate: "utf8_general_ci" }
	);

	Translation.associate = (models) => {
		Translation.belongsTo(models.Highlight, { foreignKey: "highlightId" });
		Translation.belongsToMany(models.User, { through: "User_Translation" });
	};

	return Translation;
};

module.exports = initTranslationModel(sequelize, DataTypes);
