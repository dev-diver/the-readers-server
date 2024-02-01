let users = [];

// Join user to chat
const userJoin = (id, roomId, bookId, memberId, userId, userName, host, presenter) => {
	const user = { id, roomId, bookId, memberId, userId, userName, host, presenter };
	users.push(user);
	return user;
};

const userChange = (newUser) => {
	users = users.map((user) => {
		if (user.userId === newUser.userId) {
			return newUser; // userId가 일치하면 newUser로 변경
		}
		return user; // 그렇지 않으면 기존 사용자를 반환
	});
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
	userChange,
	userLeave,
	getUsers,
};
