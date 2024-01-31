const users = [];

// Join user to chat
const userJoin = (id, roomId, bookId, userId, userName, host, presenter) => {
	const user = { id, roomId, bookId, userId, userName, host, presenter };

	users.push(user);
	return user;
};
// User leaves chat
const userLeave = (id) => {
	const index = users.findIndex((user) => user.id === id);
	console.log("userLeave index:", index);
	if (index !== -1) {
		const result = users.splice(index, 1)[0];
		return result;
	}
};

//get users
const getUsers = (roomId) => {
	const RoomUsers = [];
	users.map((user) => {
		if (user.roomId == roomId) {
			RoomUsers.push(user);
		}
	});

	return RoomUsers;
};

module.exports = {
	userJoin,
	userLeave,
	getUsers,
};
