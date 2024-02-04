const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initUserModel = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User", // 어디 필드가 unique인지 확인 필요
		{
			email: {
				type: DataTypes.STRING(40), //40
				allowNull: true,
				unique: true,
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
			timestamps: false,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);

	User.associate = (models) => {
		User.belongsToMany(User, {
			//이거 둘이 반대인 거 이상한데..
			foreignKey: "followingId",
			as: "Followers",
			through: "Follow",
		});
		User.belongsToMany(User, {
			foreignKey: "followerId",
			as: "Followings",
			through: "Follow",
		});

		User.belongsToMany(models.Book, { through: "User_Book" });
		// User.belongsToMany(models.Room, { through: "Room_User" });
		// 명시적인 관계 설정 (foreignKey, otherKey)
		User.belongsToMany(models.Room, {
			through: "Room_User", // 조인 테이블 이름 설정
			foreignKey: "UserId", // User 모델에서 사용될 외래 키
			otherKey: "RoomId", // Room 모델에서 사용될 외래 키
		});
		User.belongsToMany(models.Highlight, { through: "User_Highlight" });
		User.belongsToMany(models.Translation, { through: "User_Translation" });
	};

	return User;
};
module.exports = initUserModel(sequelize, DataTypes);
