module.exports = (sequelize, DataTypes) => {
	const Book = sequelize.define(
		"Book",
		{
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: true,
			underscored: false,
			paranoid: true,
			charset: "utf8",
			collate: "utf8_general_ci",
		}
	);

	Book.associate = (models) => {
		Book.belongsToMany(models.Room, { through: "Room_Book" });
		Book.belongsToMany(models.User, { through: "User_Book" });
	};

	return Book;
};
