const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require(__dirname + "/../config/db.js");

const User = sequelize.define(
	"User", // 어디 필드가 unique인지 확인 필요
	{
		email: {
			type: DataTypes.STRING(40), //40
			allowNull: true,
			primaryKey: true,
		},
		nick: {
			type: DataTypes.STRING(15), //15
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(11), //11
			allowNull: true,
		},
		provider: {
			type: DataTypes.ENUM("local", "kakao"),
			allowNull: false,
			defaultValue: "local",
		},
		snsId: {
			type: DataTypes.STRING(30),
			allowNull: true,
		},
	},
	{
		sequelize,
		timestamps: true,
		underscored: false,
		modelName: "User",
		tableName: "Users",
		paranoid: true,
		charset: "utf8",
		collate: "utf8_general_ci",
	}
);
User.belongsToMany(User, {
	foreignKey: "followingId",
	as: "Followers",
	through: "Follow",
});
User.belongsToMany(User, {
	foreignKey: "followerId",
	as: "Followings",
	through: "Follow",
});

module.exports = User;
