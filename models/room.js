const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const initRoomModel = (sequelize, DataTypes) => {
	const Room = sequelize.define(
		"Room",
		{
			title: {
				type: DataTypes.STRING(40),
				allowNull: true,
			},
			usermax: {
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
	); // Add closing parenthesis here

	Room.associate = (models) => {
		Room.belongsToMany(models.Book, { through: "Room_Book" });
		// Room.belongsToMany(models.User, { through: "Room_User" });
		// 명시적인 관계 설정 (foreignKey, otherKey)
		Room.belongsToMany(models.User, {
			through: "Room_User", // 조인 테이블 이름 설정
			foreignKey: "RoomId", // Room 모델에서 사용될 외래 키
			otherKey: "UserId", // User 모델에서 사용될 외래 키
		});
	};
	// Room 테이블 초기화
	// Room.sync({ alter: true });

	return Room;
};

module.exports = initRoomModel(sequelize, DataTypes);
